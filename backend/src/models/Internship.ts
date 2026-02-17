import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema({
  title: String,
  description: String,
  achievements: Array,
}, { timestamps: true });

export default mongoose.model("Internship", InternshipSchema);
