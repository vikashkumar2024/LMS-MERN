// payment.controller.js
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/purchasecoursemodel.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

// Create Razorpay Order
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const amountInPaise = course.coursePrice * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { userId, courseId },
    });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: order.id,
    });

    await newPurchase.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RZP_KEY_ID,
      courseTitle: course.courseTitle,
      courseThumbnail: course.courseThumbnail,
    });
  } catch (error) {
    console.error("createCheckoutSession Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Manual payment verification (no webhook)
// controllers/payment.controller.js

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    // Validate signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Find the course purchase
    const purchase = await CoursePurchase.findOne({ paymentId: razorpay_order_id });

    if (!purchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    // Update purchase status
    purchase.status = "completed";
    purchase.paymentDoneId = razorpay_payment_id; // Optional extra field
    await purchase.save();

    // Enroll the user
    await User.findByIdAndUpdate(purchase.userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: purchase.userId },
    });

    return res.status(200).json({ success: true, message: "Payment verified and course unlocked" });
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    res.status(200).json({
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// export const updateCourseEnrollment = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { courseId } = req.body;

//     await Course.findByIdAndUpdate(courseId, {
//       $addToSet: { enrolledStudents: userId },
//     });

//     await User.findByIdAndUpdate(userId, {
//       $addToSet: { enrolledCourses: courseId },
//     });

//     res.status(200).json({ success: true, message: "Enrollment updated" });
//   } catch (error) {
//     console.error("Enrollment update error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



export const updateCourseEnrollment = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId, razorpay_order_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid courseId" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const purchase = await CoursePurchase.findOne({
      courseId,
      userId,
      paymentId: razorpay_order_id,
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase record not found" });
    }

    // If already completed, no need to process again
    if (purchase.status === "completed") {
      return res.status(200).json({ success: true, message: "Already enrolled" });
    }

    // Update purchase status
    purchase.status = "completed";
    await purchase.save();

    // Enroll the user
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );

    // Make all lectures previewable
    if (course.lectures?.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: course.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    res.status(200).json({ success: true, message: "Enrollment updated" });
  } catch (error) {
    console.error("Enrollment update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

