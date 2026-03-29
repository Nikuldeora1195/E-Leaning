// models/Assignment.js

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
