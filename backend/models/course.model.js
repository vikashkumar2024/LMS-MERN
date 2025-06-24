import mongoose from "mongoose";
import { lectureSchema } from "./lecture.model.js"; // Import the schema, not the model

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  category: { type: String, required: true },
  courseLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  coursePrice: { type: Number },
  courseThumbneil: { type: String },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    }
  ], // Use the schema here for embedded subdocuments
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);