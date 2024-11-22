const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res, next) => {
  try {
    const reviews = await db.getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
