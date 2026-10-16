import "dotenv/config";
import express from "express";
import http from "node:http";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import projectRoutes from "./src/routes/projects.js";
import taskRoutes from "./src/routes/tasks.js";
import teamRoutes from "./src/routes/teams.js";
import aiRoutes from "./src/routes/ai.js";
import jwt from "jsonwebtoken";
import User from "./src/models/User.js";
import Workspace from "./src/models/Workspace.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set and at least 32 characters long.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
const io = new Server(server, { cors: { origin: allowedOrigin, credentials: true } });
app.set("io", io);

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: "draft-8", legacyHeaders: false }));
app.get("/health", (_req, res) => res.json({ status: "ok", service: "taskflow-ai-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/ai", aiRoutes);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id");
    if (!user) return next(new Error("User not found"));
    socket.userId = user._id.toString();
    next();
  } catch { next(new Error("Invalid session")); }
});

io.on("connection", async (socket) => {
  const workspaces = await Workspace.find({ "members.user": socket.userId }).select("_id");
  workspaces.forEach(ws => socket.join(ws._id.toString()));
  socket.emit("connected", { userId: socket.userId });
});

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ message: "A record with this value already exists." });
  res.status(err.status || 500).json({ message: err.message || "Internal server error." });
});

const port = Number(process.env.PORT) || 5000;
connectDB().then(() => server.listen(port, () => console.log(`TaskFlow AI API listening on ${port}`))).catch(err => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});
