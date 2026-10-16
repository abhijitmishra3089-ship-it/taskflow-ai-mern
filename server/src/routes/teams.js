import { Router } from "express";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);

router.get("/members", asyncHandler(async (req, res) => {
  let workspace = await Workspace.findOne({ "members.user": req.user._id }).populate("members.user", "name email avatar");
  if (!workspace) workspace = await Workspace.create({ name: "My workspace", owner: req.user._id, members: [{ user: req.user._id, role: "owner" }] });
  res.json({ workspace, members: workspace.members.map(m => ({ user: m.user, role: m.role, joinedAt: m.joinedAt })) });
}));

router.post("/members", asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const workspace = await Workspace.findOne({ "members.user": req.user._id });
  if (!workspace) return res.status(404).json({ message: "Workspace not found." });
  const current = workspace.members.find(m => m.user.toString() === req.user._id.toString());
  if (!current || !["owner", "admin"].includes(current.role)) return res.status(403).json({ message: "Only workspace admins can add members." });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account found for this email. Ask them to sign up first." });
  if (workspace.members.some(m => m.user.toString() === user._id.toString())) return res.status(409).json({ message: "This user is already a member." });
  workspace.members.push({ user: user._id, role: req.body.role === "admin" ? "admin" : "member" });
  await workspace.save();
  const updated = await Workspace.findById(workspace._id).populate("members.user", "name email avatar");
  res.status(201).json({ members: updated.members.map(m => ({ user: m.user, role: m.role, joinedAt: m.joinedAt })) });
}));

export default router;
