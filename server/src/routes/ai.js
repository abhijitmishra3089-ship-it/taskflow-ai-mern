import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);

router.post(
  "/breakdown",
  asyncHandler(async (req, res) => {
    const goal = String(req.body.goal || "").trim();
    if (goal.length < 8)
      return res
        .status(400)
        .json({ message: "Describe the goal in at least 8 characters." });
    if (!process.env.GEMINI_API_KEY)
      return res
        .status(503)
        .json({
          message:
            "AI is not configured yet. Add GEMINI_API_KEY to server/.env.",
        });
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Break this project goal into 4 to 8 actionable tasks. Return only valid JSON array. Each item must have "title", "description", "priority" (low, medium, or high). Keep each task concise. Goal: ${goal}`,
    });
    const raw = (response.text || "")
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    let tasks;
    try {
      tasks = JSON.parse(raw);
    } catch {
      return res
        .status(502)
        .json({
          message: "AI returned an unreadable response. Please try again.",
        });
    }
    if (!Array.isArray(tasks))
      return res
        .status(502)
        .json({ message: "AI response format was unexpected." });
    res.json({
      tasks: tasks.slice(0, 8).map((t) => ({
        title: String(t.title || "Untitled task").slice(0, 180),
        description: String(t.description || "").slice(0, 1000),
        priority: ["low", "medium", "high"].includes(t.priority)
          ? t.priority
          : "medium",
      })),
    });
  }),
);

export default router;
