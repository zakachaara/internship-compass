import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import achievementRoutes from "./routes/achievement.routes";
import categoryRoutes from "./routes/category.routes";

const PORT =  Number(process.env.PORT) || 5000;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();


app.use("/api/achievements", achievementRoutes);
app.use("/api/categories", categoryRoutes);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

