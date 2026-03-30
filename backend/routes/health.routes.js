const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    status: "OK",
    message: "LearnMax backend is healthy",
  });
});

module.exports = router;
