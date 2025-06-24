import mongoose from "mongoose";

const CoursePurchaseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    required: true, // Razorpay order ID
  },
  paymentDoneId: {
    type: String, // Razorpay payment ID after successful payment
  },
  paymentSignature: {
    type: String, // Optional for debugging or audit trail
  }
}, { timestamps: true });

export const CoursePurchase = mongoose.model('CoursePurchase', CoursePurchaseSchema);
