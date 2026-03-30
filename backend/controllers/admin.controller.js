const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

/**
 * @desc Get all users
 * @route GET /api/admin/users
 * @access Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update user role
 * @route PUT /api/admin/users/:id/role
 * @access Admin
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    if (role === "teacher") {
      user.teacherRequestStatus = "approved";
    } else if (role !== "teacher" && user.teacherRequestStatus === "approved") {
      user.teacherRequestStatus = "none";
    }
    await user.save();

    res.json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewTeacherRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.teacherRequestStatus !== "requested") {
      return res.status(400).json({ message: "No pending teacher request" });
    }

    if (action === "approve") {
      user.role = "teacher";
      user.teacherRequestStatus = "approved";
    } else if (action === "reject") {
      user.role = "student";
      user.teacherRequestStatus = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid review action" });
    }

    await user.save();

    res.json({ message: "Teacher request updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Enable / Disable user
 * @route PUT /api/admin/users/:id/status
 * @access Admin
 */
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all courses
 * @route GET /api/admin/courses
 * @access Admin
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("createdBy", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete course
 * @route DELETE /api/admin/courses/:id
 * @access Admin
 */
const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Admin dashboard stats
 * @route GET /api/admin/stats
 * @access Admin
 */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const pendingTeacherRequests = await User.countDocuments({
      teacherRequestStatus: "requested",
    });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      pendingTeacherRequests,
      totalCourses,
      totalEnrollments,
      completionRate: 65 // simulated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  reviewTeacherRequest,
  toggleUserStatus,
  getAllCourses,
  deleteCourse,
  getAdminStats
};
