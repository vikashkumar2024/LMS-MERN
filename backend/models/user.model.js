import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["instructer", "student"],
    default: "student" // corrected spelling
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId, // corrected 'types' to 'type'
      ref: "Course"
    }
  ],
  photoUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true }); // corrected 'timestamp' to 'timestamps'

export const User = mongoose.model("User", userSchema);
