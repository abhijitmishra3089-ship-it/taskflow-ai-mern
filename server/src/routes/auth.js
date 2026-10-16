import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  avatar: u.avatar,
  createdAt: u.createdAt,
});
const issueToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SECURE === "true" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");
    if (name.length < 2)
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Enter a valid email." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    if (await User.exists({ email }))
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    });
    const workspace = await Workspace.create({
      name: `${name}'s workspace`,
      owner: user._id,
      members: [{ user: user._id, role: "owner" }],
    });
    const token = issueToken(user._id);
    res.cookie("token", token, cookieOptions());
    res
      .status(201)
      .json({ user: publicUser(user), token, workspaceId: workspace._id });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    const token = issueToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.json({ user: publicUser(user), token });
  }),
);

router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) })),
);
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SECURE === "true" ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logged out." });
});

router.patch(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    if (name.length < 2)
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters." });
    req.user.name = name;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  }),
);

export default router;
