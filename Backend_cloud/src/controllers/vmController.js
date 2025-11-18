// src/controllers/vmController.js
const clientsStore = require("../clients/clientsStore");
const wsService = require("../services/wsService");
const logger = require("../utils/logger");
const vmStore = require("../vm/vmStore");
const Vm = require("../models/vm");      // <-- ADD THIS

// CREATE VM
// CREATE VM - authenticated users only (attach owner)
exports.createVm = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "unauthenticated" });

    const { cpu, memory, storage, os, name } = req.body;
    const agent = clientsStore.chooseBestClient();
    if (!agent) return res.status(500).json({ error: "no_agent_connected" });

    const msg = { type: "create-vm", payload: { cpu, memory, storage, os, name } };
    const reply = await wsService.sendToClient(agent.id, msg, { waitFor: "vm-created", timeoutMs: 60000 });

    const payload = reply.payload || {};
    const vmId = payload.vmId || payload.id || payload.name;
    if (!vmId) {
      return res.status(500).json({ ok: false, error: "agent_did_not_return_vmId" });
    }

    // persist to DB with owner and clientId
    const vmDoc = await Vm.create({
      vmId,
      name: payload.name || name,
      owner: user.id,
      clientId: agent.id,
      ip: payload.ip,
      cpu: payload.cpu,
      memory: payload.memory,
      image: payload.image,
      status: payload.status || "running"
    });

    // save mapping in vmStore for routing
    vmStore.save(vmId, agent.id, { owner: user.id, name: vmDoc.name });

    return res.json({ ok: true, clientId: agent.id, created: vmDoc });
  } catch (err) {
    logger.error("createVm error:", err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};

// START VM
exports.startVm = async (req, res) => {
  try {
    const vmId = req.params.id;
    if (!vmId) return res.status(400).json({ error: "vmId_required" });

    const vmDoc = await Vm.findOne({ vmId });
    if (!vmDoc) return res.status(404).json({ error: "vm_not_known" });

    const clientId = vmDoc.clientId;
    if (!clientId) return res.status(500).json({ error: "vm_missing_client" });

    // ensure client connected
    const client = clientsStore.get(clientId);
    if (!client) return res.status(404).json({ error: "client_not_connected" });

    // send start request and optionally wait for confirmation
    await wsService.sendToClient(clientId, { type: "start-vm", payload: { vmId } }, { waitFor: null });

    return res.json({ ok: true, vmId, clientId });
  } catch (err) {
    logger.error("startVm error:", err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};
// GET /vms/:vmId
// GET /vms/:vmId — returns DB data plus live status if agent connected
exports.getVmById = async (req, res) => {
  try {
    const vmId = req.params.vmId;
    if (!vmId) return res.status(400).json({ error: "vmId_required" });

    const vmDoc = await Vm.findOne({ vmId });
    if (!vmDoc) return res.status(404).json({ error: "vm_not_found" });

    // user access check
    if (req.user.role !== "admin" && String(vmDoc.owner) !== String(req.user.id)) {
      return res.status(403).json({ error: "not_vm_owner" });
    }

    // By default return DB info
    const result = { ok: true, vm: vmDoc.toObject() };

    // If vm is associated with an agent and that agent is connected, ask agent for live state
    if (vmDoc.clientId) {
      const client = clientsStore.get(vmDoc.clientId);
      if (client && client.ws && client.ws.readyState === client.ws.OPEN) {
        try {
          // ask agent to inspect vm; agent must reply with type "vm-inspected"
          const reply = await wsService.sendToClient(client.id, {
            type: "inspect-vm",
            payload: { vmId }
          }, { waitFor: "vm-inspected", timeoutMs: 8000 });

          // merge or override 'status' with live info if provided
          const live = (reply && reply.payload) ? reply.payload : null;
          if (live) {
            result.vm.liveStatus = live.status || live.state || null;
            if (live.ip) result.vm.ip = live.ip;
            if (live.message) result.vm.inspectMessage = live.message;
            // include full live payload for debugging
            result.vm.live = live;
          }
        } catch (err) {
          // agent didn't respond in time or error — include a helpful flag
          result.vm.liveStatus = "unknown";
          result.vm.inspectError = err && err.message ? err.message : String(err);
        }
      } else {
        result.vm.liveStatus = "agent_offline";
      }
    } else {
      // no client associated
      result.vm.liveStatus = "no_client_assigned";
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};


// stop a VM — similar
exports.stopVm = async (req, res) => {
  try {
    const vmId = req.params.id;
    if (!vmId) return res.status(400).json({ ok: false, error: "vmId_required" });

    // find vm in DB
    const vmDoc = await Vm.findOne({ vmId });
    if (!vmDoc) return res.status(404).json({ ok: false, error: "vm_not_found" });

    // Ownership check: non-admins must own the VM
    if (req.user?.role !== "admin" && String(vmDoc.owner) !== String(req.user?.id)) {
      return res.status(403).json({ ok: false, error: "not_vm_owner" });
    }

    // ensure we have client mapping
    const clientId = vmDoc.clientId;
    if (!clientId) return res.status(500).json({ ok: false, error: "vm_has_no_client" });

    const client = clientsStore.get(clientId);
    if (!client || !client.ws || client.ws.readyState !== client.ws.OPEN) {
      return res.status(500).json({ ok: false, error: "client_not_connected" });
    }

    // Build stop message (attach vmId). Use a nonce automatically in wsService.
    const msg = {
      type: "stop-vm",
      payload: { vmId }
    };

    // Wait for agent reply: we expect type "vm-stopped"
    // adjust timeoutMs as appropriate (here 30s)
    let reply;
    try {
      reply = await wsService.sendToClient(clientId, msg, {
        waitFor: "vm-stopped",
        timeoutMs: 30000
      });
    } catch (err) {
      // timeout or agent error
      logger.error("stopVm: wsService.sendToClient failed:", err && err.message ? err.message : err);
      return res.status(504).json({ ok: false, error: "agent_response_timeout", detail: err && err.message ? err.message : String(err) });
    }

    // reply.payload expected structure: { serverJobId, vmId, success, status, message? }
    const payload = reply.payload || {};

    // Update DB status if success or update to what agent reports
    try {
      const newStatus = payload.status || (payload.success ? "stopped" : "unknown");
      vmDoc.status = newStatus;
      // optionally store lastInspect/lastLive info
      vmDoc.lastAgentReply = { time: new Date(), payload };
      await vmDoc.save();
    } catch (dbErr) {
      logger.warn("stopVm: failed to update VM doc:", dbErr && dbErr.message ? dbErr.message : dbErr);
    }

    // Return the agent's payload to API caller
    return res.json({ ok: true, result: payload });
  } catch (err) {
    logger.error("stopVm: unexpected error:", err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};

// EXEC COMMAND (no client checking for now)
// execVm - enforce ownership
exports.execVm = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "unauthenticated" });

    const { clientId, vmId, command } = req.body;
    if (!clientId || !vmId || !command) return res.status(400).json({ error: "clientId_vmId_command_required" });

    // verify vm exists and ownership
    const Vm = require("../models/vm");
    const vmDoc = await Vm.findOne({ vmId });
    if (!vmDoc) return res.status(404).json({ error: "vm_not_known" });

    // allowed if owner is user OR user.role === 'admin'
    if (String(vmDoc.owner) !== String(user.id) && user.role !== "admin") {
      return res.status(403).json({ error: "not_vm_owner" });
    }

    // ensure client matches ownership mapping
    if (vmDoc.clientId !== clientId) {
      return res.status(409).json({ error: "vm_owned_by_other_client", ownerClient: vmDoc.clientId });
    }

    // ensure client is connected
    const client = require("../clients/clientsStore").get(clientId);
    if (!client) return res.status(404).json({ error: "client_not_connected" });

    const msg = { type: "exec-vm", payload: { vmId, command } };
    const reply = await require("../services/wsService").sendToClient(clientId, msg, { waitFor: "vm-output", timeoutMs: 60000 });

    return res.json({ ok: true, output: reply.payload });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};
