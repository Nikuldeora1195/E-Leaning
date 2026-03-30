// const { completeLesson } = require("../../frontend/src/api/courseApi");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");

// ===============================
// CREATE COURSE (TEACHER)
// ===============================
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET ALL PUBLISHED COURSES
// ===============================
const getCourses = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = { isPublished: true };

    // If search query exists
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter)
      .populate("createdBy", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// PUBLISH COURSE
// ===============================
const publishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to publish this course" });
    }

    course.isPublished = true;
    await course.save();

    res.json({ message: "Course published successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET STUDENTS OF COURSE
// ===============================
const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to view enrollments" });
    }

    const enrollments = await Enrollment.find({
      course: course._id,
    }).populate("student", "name email");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// TEACHER: MY COURSES
// ===============================
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      createdBy: req.user.id,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Edit course (Teacher only)
const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ownership check
    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this course" });
    }

    course.title = title || course.title;
    course.description = description || course.description;

    await course.save();

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const togglePublish = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) return res.status(404).json({ message: "Course not found" });

  if (course.createdBy.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  course.isPublished = !course.isPublished;
  await course.save();

  res.json({
    message: course.isPublished
      ? "Course published"
      : "Course unpublished",
    isPublished: course.isPublished,
  });
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherAnalytics = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).lean();
    const courseIds = courses.map((course) => course._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    }).lean();

    const reviews = await Review.find({
      course: { $in: courseIds },
    }).lean();

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((course) => course.isPublished).length;
    const totalStudents = enrollments.length;
    const completedEnrollments = enrollments.filter(
      (enrollment) => enrollment.isCompleted
    ).length;
    const averageProgress =
      totalStudents > 0
        ? Math.round(
            enrollments.reduce(
              (sum, enrollment) => sum + (enrollment.progress || 0),
              0
            ) / totalStudents
          )
        : 0;
    const averageRating =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)
          )
        : 0;

    const topCourses = courses
      .map((course) => {
        const courseEnrollments = enrollments.filter(
          (enrollment) => enrollment.course.toString() === course._id.toString()
        );
        const courseReviews = reviews.filter(
          (review) => review.course.toString() === course._id.toString()
        );

        return {
          _id: course._id,
          title: course.title,
          isPublished: course.isPublished,
          enrollments: courseEnrollments.length,
          averageProgress:
            courseEnrollments.length > 0
              ? Math.round(
                  courseEnrollments.reduce(
                    (sum, enrollment) => sum + (enrollment.progress || 0),
                    0
                  ) / courseEnrollments.length
                )
              : 0,
          averageRating:
            courseReviews.length > 0
              ? Number(
                  (
                    courseReviews.reduce((sum, review) => sum + review.rating, 0) /
                    courseReviews.length
                  ).toFixed(1)
                )
              : 0,
        };
      })
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5);

    res.json({
      totalCourses,
      publishedCourses,
      draftCourses: totalCourses - publishedCourses,
      totalStudents,
      completedEnrollments,
      averageProgress,
      averageRating,
      topCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






module.exports = {
  createCourse,
  getCourses,
  publishCourse,
  getCourseStudents,
  getMyCourses,
  togglePublish,
getCourseById,
  getTeacherAnalytics,
// completeLesson,
  // getCourseById,
  updateCourse
};
