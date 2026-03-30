const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Section = require("../models/Section");

const recalculateEnrollmentProgress = async (enrollment, courseId) => {
  const sections = await Section.find({ course: courseId }).select("_id");
  const sectionIds = sections.map((section) => section._id);

  const lessons = await Lesson.find({
    section: { $in: sectionIds },
  }).select("_id");

  const validLessonIds = new Set(lessons.map((lesson) => lesson._id.toString()));

  enrollment.completedLessons = enrollment.completedLessons.filter((lessonId) =>
    validLessonIds.has(lessonId.toString())
  );

  const totalLessons = lessons.length;
  const completedCount = enrollment.completedLessons.length;
  const rawProgress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  enrollment.progress = Math.min(100, Math.max(0, rawProgress));
  enrollment.isCompleted = totalLessons > 0 && enrollment.progress >= 100;
  enrollment.completedAt = enrollment.isCompleted ? enrollment.completedAt || new Date() : null;
};

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

    await recalculateEnrollmentProgress(enrollment, section.course);

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

    const validEnrollments = [];
    const orphanEnrollmentIds = [];

    for (const enrollment of enrollments) {
      if (!enrollment.course) {
        orphanEnrollmentIds.push(enrollment._id);
        continue;
      }

      await recalculateEnrollmentProgress(enrollment, enrollment.course._id);
      await enrollment.save();
      validEnrollments.push(enrollment);
    }

    if (orphanEnrollmentIds.length > 0) {
      await Enrollment.deleteMany({ _id: { $in: orphanEnrollmentIds } });
    }

    res.json(validEnrollments);
  } catch (error) {
    console.error("Get my courses error:", error);
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

    enrollment.progress = Math.min(100, Math.max(0, Number(progress) || 0));
    enrollment.isCompleted = enrollment.progress >= 100;
    enrollment.completedAt = enrollment.isCompleted ? enrollment.completedAt || new Date() : null;

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
