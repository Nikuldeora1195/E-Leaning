const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");

const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate("student", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    res.json({
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: req.user.id,
      isCompleted: true,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Complete the course before leaving a review",
      });
    }

    const parsedRating = Number(rating);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.findOneAndUpdate(
      { course: courseId, student: req.user.id },
      {
        course: courseId,
        student: req.user.id,
        rating: parsedRating,
        comment: comment?.trim() || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("student", "name");

    res.json({
      message: "Review saved successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourseReviews,
  upsertCourseReview,
};
