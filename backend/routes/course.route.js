import express from "express";
import isAuthenticated from "../middlswares/isAuthenticated.js";
import upload from "../utils/multer.js";
import {
  createCourse,
  createLecture,
  EditCourse,
  editLecture,
  getAllcreatorCourses,
  getcourseByid,
  getCourseLecture,
  getLecturebyid,
  removelecture,
  togglepublishcourse,
  getAllCourse,
  getEnrolledCourses,
  searchCourse,
 
} from "../controllers/course.controller.js";

const router = express.Router();

// 🟢 Course routes
router.route("/create")
  .post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated,searchCourse);
router.route("/")
  .get(isAuthenticated, getAllcreatorCourses);

router.route("/all/course")
  .get(isAuthenticated, getAllCourse);

router.route("/enrolled-courses")
  .get(isAuthenticated, getEnrolledCourses);

router.route("/:courseId")
  .get(isAuthenticated, getcourseByid);

router.route("/:courseId/edit")
  .put(isAuthenticated, upload.single("Thumbnail"), EditCourse);

router.route("/:courseId/publish")
  .put(isAuthenticated, togglepublishcourse);

// 🟢 Lecture routes
router.route("/:courseId/lecture")
  .post(isAuthenticated, createLecture)
  .get(isAuthenticated, getCourseLecture);

router.route("/:courseId/lecture/:lectureId")
  .post(isAuthenticated, editLecture); // or use `.put()` for RESTful semantics

router.route("/lecture/:lectureId")
  .get(isAuthenticated, getLecturebyid)
  .delete(isAuthenticated, removelecture);

export default router;
