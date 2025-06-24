import express from "express";
import {
  
  getUserProfile,
  login,

  logout,

  register,
  updateProfile
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlswares/isAuthenticated.js";
import upload from "../utils/multer.js";
// Current import


// Adjust the path if your file is somewhere else


const router = express.Router();

// Routes (use lowercase paths for consistency)
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/profile").get(isAuthenticated,getUserProfile)
router.route("/updateProfile").put(isAuthenticated,upload.single("profilePhoto"),updateProfile)

export default router;
