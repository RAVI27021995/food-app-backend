const express = require("express");
const router = express.Router();

const {
  addMenuItem,
  getMenuByRestaurant,
} = require("../controllers/menuController");

// Routes
router.post("/", addMenuItem);
router.get("/:restaurantId", getMenuByRestaurant);

module.exports = router;