import mongoose from "mongoose";

import Category from "../models/Category"; // Adjust path to your Category model

const DEFAULT_CATEGORIES = [
  { _id: "backend", name: "Backend", color: "hsl(220, 70%, 55%)" },
  { _id: "frontend", name: "Frontend", color: "hsl(172, 60%, 45%)" },
  { _id: "devops", name: "DevOps", color: "hsl(280, 55%, 60%)" },
  { _id: "research", name: "Research", color: "hsl(35, 85%, 60%)" },
  { _id: "meetings", name: "Meetings", color: "hsl(340, 60%, 60%)" },
  { _id: "learning", name: "Learning", color: "hsl(152, 55%, 45%)" },
];

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!).then(async () => {
      console.log("✅ Connected to MongoDB");

      console.log("Checking for existing categories...");

      for (const category of DEFAULT_CATEGORIES) {
        // Check if category already exists by _id or name
        const existing = await Category.findOne({
          $or: [{ _id: category._id }, { name: category.name }],
        });

        if (!existing) {
          await Category.create(category);
          console.log(`Added category: ${category.name}`);
        } else {
          console.log(
            `Category "${category.name}" already exists, skipping...`,
          );
        }
      }

      console.log("Category seeding completed!");
      
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};
