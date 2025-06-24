import express from "express";
import {
  createCheckoutSession,
  
  getCourseDetailWithPurchaseStatus,
  verifyPayment,
  getAllPurchasedCourse,
  updateCourseEnrollment
} from "../controllers/coursepurchase.controller.js";
import isAuthenticated from "../middlswares/isAuthenticated.js";

const router = express.Router();

// POST: Create a Razorpay order for a course
router.post(
  "/checkout/create-checkout-session",
  isAuthenticated,
  createCheckoutSession
);



// POST: Manually verify payment if webhook isn't used
router.post(
  "/payment/verify",
  isAuthenticated,
  verifyPayment
);

// GET: Get course details with purchase status
router.get(
  "/course/:courseId/detail-with-status",
  isAuthenticated,
  getCourseDetailWithPurchaseStatus
);

// GET: Admin or User route to get all purchased courses
router.get(
  "/course/purchased/all",
  isAuthenticated,
  getAllPurchasedCourse
);

router.route("/update-enrollment").patch(isAuthenticated, updateCourseEnrollment);


export default router;
