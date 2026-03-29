const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Section = require("../models/Section");

// ---------------------- COMPLETE LESSON ----------------------
const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const section = await Section.findById(lesson.section);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const enrollment = await Enrollment.findOne({
      student: userId,
      course: section.course,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in course" });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const sections = await Section.find({ course: section.course });
    const sectionIds = sections.map((s) => s._id);

    const totalLessons = await Lesson.countDocuments({
      section: { $in: sectionIds },
    });

    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    if (enrollment.progress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    console.error("Complete lesson error:", error);
    res.status(500).json({ message: "Lesson completion failed" });
  }
};

// ---------------------- ENROLL ----------------------
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user.id;

    const course = await Course.findOne({
      _id: courseId,
      isPublished: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not available" });
    }

    const already = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (already) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- MY COURSES ----------------------
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
    }).populate("course", "title description");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- UPDATE PROGRESS ----------------------
const updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    enrollment.progress = progress;

    if (progress === 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SINGLE EXPORT STYLE (NO MIXING)
module.exports = {
  enrollInCourse,
  getMyCourses,
  updateProgress,
  completeLesson,
};
