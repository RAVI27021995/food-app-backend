const express = require("express");
const router = express.Router();
const { getRestaurantById } = require("../controllers/restaurantController");

const {
  addRestaurant,
  getRestaurants,
} = require("../controllers/restaurantController");

// Routes
router.post("/", addRestaurant);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

module.exports = router;