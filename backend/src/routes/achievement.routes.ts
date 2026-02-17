import { Router } from "express";
import Achievement from "../models/Achievement";

const router = Router();

// GET all
router.get("/", async (_req, res) => {
  const achievements = await Achievement.find().sort({ createdAt: -1 });
  res.json(achievements);
});

// CREATE
router.post("/", async (req, res) => {
  const achievement = await Achievement.create(req.body);
  res.status(201).json(achievement);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Achievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
