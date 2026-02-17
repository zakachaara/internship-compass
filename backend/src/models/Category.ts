import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    _id: { 
      type: String, 
      required: [true, "Category name is required"],
    },
    name: { 
      type: String, 
      required: [true, "Category name is required"],
      trim: true 
    },
    color: { 
      type: String, 
      required: [true, "Color is required"],
       // Default blue color if none provided
    },
    icon: { 
      type: String,
      default: "folder" // Default icon if none provided
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add any indexes for better performance
CategorySchema.index({ name: 1 });

export default mongoose.model("Category", CategorySchema);