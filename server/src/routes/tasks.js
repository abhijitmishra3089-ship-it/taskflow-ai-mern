import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);
const allowedStatuses = ["todo", "progress", "review", "done"];
const allowedPriorities = ["low", "medium", "high"];

async function userProject(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId)) return null;
  const project = await Project.findById(projectId);
  if (!project) return null;
  const Workspace = (await import("../models/Workspace.js")).default;
  const member = await Workspace.exists({ _id: project.workspace, "members.user": userId });
  return member ? project : null;
}

router.get("/", asyncHandler(async (req, res) => {
  const projects = await Project.find({ createdBy: req.user._id }).select("_id");
  const Workspace = (await import("../models/Workspace.js")).default;
  const workspaces = await Workspace.find({ "members.user": req.user._id }).select("_id");
  const projectIds = await Project.find({ workspace: { $in: workspaces.map(w => w._id) } }).distinct("_id");
  const filter = projectIds.length ? { project: { $in: projectIds } } : { createdBy: req.user._id };
  if (req.query.projectId) filter.project = req.query.projectId;
  const tasks = await Task.find(filter).populate("assignee", "name email").populate("project", "name color").sort({ updatedAt: -1 });
  res.json({ tasks });
}));

router.post("/", asyncHandler(async (req, res) => {
  const project = await userProject(req.body.projectId, req.user._id);
  if (!project) return res.status(404).json({ message: "Project not found in your workspace." });
  const title = String(req.body.title || "").trim();
  if (!title) return res.status(400).json({ message: "Task title is required." });
  const task = await Task.create({
    title, description: String(req.body.description || ""),
    status: allowedStatuses.includes(req.body.status) ? req.body.status : "todo",
    priority: allowedPriorities.includes(req.body.priority) ? req.body.priority : "medium",
    dueDate: req.body.dueDate || null, project: project._id, workspace: project.workspace,
    assignee: req.body.assignee || null, createdBy: req.user._id
  });
  const fullTask = await Task.findById(task._id).populate("assignee", "name email").populate("project", "name color");
  req.app.get("io").to(project.workspace.toString()).emit("task:created", fullTask);
  res.status(201).json({ task: fullTask });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task id." });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  const project = await userProject(task.project, req.user._id);
  if (!project) return res.status(403).json({ message: "You cannot edit this task." });
  for (const key of ["title", "description", "dueDate", "assignee"]) if (key in req.body) task[key] = req.body[key];
  if (allowedStatuses.includes(req.body.status)) task.status = req.body.status;
  if (allowedPriorities.includes(req.body.priority)) task.priority = req.body.priority;
  await task.save();
  const fullTask = await Task.findById(task._id).populate("assignee", "name email").populate("project", "name color");
  req.app.get("io").to(project.workspace.toString()).emit("task:updated", fullTask);
  res.json({ task: fullTask });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task id." });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  const project = await userProject(task.project, req.user._id);
  if (!project) return res.status(403).json({ message: "You cannot delete this task." });
  await task.deleteOne();
  req.app.get("io").to(project.workspace.toString()).emit("task:deleted", { _id: task._id });
  res.json({ message: "Task deleted." });
}));

export default router;
