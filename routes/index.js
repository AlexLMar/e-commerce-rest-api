const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const orderRoutes = require("./orderRoutes");
const reviewRoutes = require("./reviewRoutes");
// const adminRoutes = require("./admin");
const cartRoutes = require("./cartRoutes");

// Define main routes
router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Mount all routes
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
// router.use("/admin", adminRoutes);
router.use("/cart", cartRoutes);

// Export the main router
module.exports = router;
