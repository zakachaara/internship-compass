import { Router } from "express";
import Category from "../models/Category";

const router = Router();

// GET all
router.get("/", async (_req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// CREATE
router.post("/", async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
