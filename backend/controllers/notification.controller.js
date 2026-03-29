const Notification = require("../models/Notification");

// Create announcement
const createNotification = async (req, res) => {
  try {
    const { title, message, course } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required"
      });
    }

    const notification = await Notification.create({
      title,
      message,
      course,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Announcement created",
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications for student
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("createdBy", "name role")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications
};
