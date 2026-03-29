const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "EduVillage backend is healthy"
  });
});

module.exports = router;
