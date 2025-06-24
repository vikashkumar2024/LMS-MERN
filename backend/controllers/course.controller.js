import { Course } from "../models/course.model.js";
import { Lecture } from '../models/lecture.model.js';
import { deleteVideoFromCloudinary, uploadMedia,deleteMediaFromCloudinary } from "../utils/cloudinary.js";



export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
 
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "course title and category are required.",
      });
    }

    const course = await Course.create({
      title,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course.",
    });
  }
};
export const searchCourse=async(req,res)=>{
  try{
    const {query= "",categories=[],sortByprice=""}=req.query;
    const searchCriteria = {
      isPublished: true,
      $or: [
        { coursetitle: { $regex: query, $options: "i" } }, // case-insensitive search in title
      {subtitle: { $regex: query, $options: "i" } },// case-insensitive search
      {category:{$regex:query,$options:"i"}}, // case-insensitive search in category
    ]}
    if(categories.length>0){
      searchCriteria.category={$in:categories}
    }
    const sortoption={};
    if(sortByprice==="low"){
      sortoption.coursePrice=1; // ascending order
    }
    else if(sortByprice==="high"){
      sortoption.coursePrice=-1; // descending order
    }
  let courses = await Course.find(searchCriteria)
  .sort(sortoption)
  .populate({ path: "creator", select: "name photoUrl" });
    return res.status(200).json({
      success:true,
      courses:courses ||[]
    })
  }catch(error){
    console.log(error);
    
  }
}
export const getAllcreatorCourses = async (req, res) => {
  try {
    const userId = req.id;

    const courses = await Course.find({});
    
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "No courses found for this user.",
      });
    }

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Error getting courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all courses.",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title and course ID are required",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
      course, // Optional: include updated course if needed
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("Error getting course lectures:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course lectures",
    });
  }
};

export const EditCourse = async (req, res) => {
  try {
    const { title, subtitle, description, category, coursePrice, courseLevel } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Update basic fields
    course.title = title;
    course.subtitle = subtitle;
    course.description = description;
    course.category = category;
    course.coursePrice = coursePrice;
    course.courseLevel = courseLevel;

    // ✅ Handle thumbnail upload to Cloudinary
    if (req.file) {
      // If previous thumbnail exists, delete from Cloudinary (optional but recommended)
      if (course.courseThumbneil?.includes("res.cloudinary.com")) {
        const publicId = course.courseThumbneil.split("/").pop().split(".")[0]; // crude way
        await deleteMediaFromCloudinary(publicId);
      }

      const uploadedThumbnail = await uploadMedia(req.file.path);
      course.courseThumbneil = uploadedThumbnail.secure_url;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Edit course error:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

export const getcourseByid = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("lectures") // populates lecture details
      .populate("creator", "name email avatar") // only desired fields
      .populate("enrolledStudents", "name email"); // only desired fields

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error getting course by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course by ID",
    });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("enrolledStudents", "name email") // optional: only if you want user details
      .select("title coursePrice enrolledStudents"); // only include necessary fields

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error in getAllCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Update fields conditionally
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (typeof isPreviewFree !== "undefined") lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure course has the lecture
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error editing lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
    });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    console.log("Fetching enrolled courses for user:", req.id);

    const courses = await Course.find({ enrolledStudents: req.id })
      .populate('creator', 'name email') // only needed fields
      .sort({ updatedAt: -1 }); // show most recent first

    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error("Error fetching enrolled courses:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch enrolled courses' });
  }
};

export const removelecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    console.log("lectureId", lectureId);
    
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    console.log("lecture", lecture);
    if (!lecture) {
      return res.status(404).json({
        message: "lecture not found!"
      });
    }
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );
    return res.status(200).json({
      message: "lecture removed successfully"
    });
  } catch (error) {
    console.log("Error removing lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
    });
  }
};

export const getLecturebyid = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "lecture not found!"
      });
    }
    return res.status(200).json({
      lecture
    });
  } catch (error) {
    console.log("Error getting lecture by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture by ID",
    });
  }
};

export const togglepublishcourse = async (req, res) => {
  try {
    const { publish } = req.body;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = publish;
    await course.save();

    res.status(200).json({
      success: true,
      message: publish ? "Course published" : "Course unpublished",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
