// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const wsServer = require("./src/ws/wsServer");
const vmRoutes = require("./src/routes/vmRoutes"); // your routes
const agentRoutes = require("./src/routes/agentRoutes");

const app = express();
app.use(express.json());
app.use("/vms", vmRoutes);
app.use("/agents", agentRoutes);

app.get("/", (req, res) => res.send("Backend API"));
const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);
const adminRoutes = require("./src/routes/adminRoutes");
app.use("/admin", adminRoutes);

const server = http.createServer(app);

// attach ws server to same HTTP server
wsServer.attachToServer(server);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server + WS listening on ${PORT}`));

// mongodb connect
mongoose.connect("mongodb+srv://aomk_db_user:aom123456789@cluster0.niqidxk.mongodb.net/?appName=Cluster0")
    .then(() => console.log("Mongo connected"))
    .catch((e) => console.error("Mongo error", e.message));
