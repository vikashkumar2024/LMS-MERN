import mongoose from "mongoose";

export const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: { type: String, required: true },
    videoUrl: { type: String },
    publicId: { type: String },
    ispreviewfree: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);