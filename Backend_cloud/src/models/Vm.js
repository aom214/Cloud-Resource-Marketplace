// src/models/vm.js
const mongoose = require("mongoose");

const VmSchema = new mongoose.Schema({
  vmId: { type: String, required: true, unique: true },
  name: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner user id
  clientId: { type: String, required: true }, // which agent created it
  ip: String,
  cpu: Number,
  memory: String,
  image: String,
  status: { type: String, default: "running" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Vm", VmSchema);
