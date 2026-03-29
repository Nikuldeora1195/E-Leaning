const Enrollment = require("../models/Enrollment");

exports.generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student", "name")
      .populate("course", "title");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (!enrollment.isCompleted) {
      return res.status(400).json({
        message: "Course not completed yet",
      });
    }

    // 🧪 SIMULATED CERTIFICATE URL
    const certificateUrl = `https://certificate.eduvillage.fake/${enrollment._id}`;

    enrollment.certificateIssued = true;
    enrollment.certificateUrl = certificateUrl;
    await enrollment.save();

    res.json({
      message: "Certificate generated successfully",
      certificate: {
        student: enrollment.student.name,
        course: enrollment.course.title,
        issuedAt: new Date(),
        certificateUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Certificate generation failed" });
  }
};
