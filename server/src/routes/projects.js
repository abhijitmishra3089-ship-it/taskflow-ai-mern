import { Router } from "express";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);

async function getWorkspaceForUser(userId) {
  let ws = await Workspace.findOne({ "members.user": userId });
  if (!ws) ws = await Workspace.create({ name: "My workspace", owner: userId, members: [{ user: userId, role: "owner" }] });
  return ws;
}

router.get("/", asyncHandler(async (req, res) => {
  const ws = await getWorkspaceForUser(req.user._id);
  const projects = await Project.find({ workspace: ws._id }).sort({ updatedAt: -1 });
  res.json({ workspace: ws, projects });
}));

router.post("/", asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (name.length < 2) return res.status(400).json({ message: "Project name must be at least 2 characters." });
  const ws = await getWorkspaceForUser(req.user._id);
  const project = await Project.create({ name, description: String(req.body.description || ""), color: req.body.color || "#8b5cf6", workspace: ws._id, createdBy: req.user._id });
  res.status(201).json({ project, workspace: ws });
}));

export default router;
