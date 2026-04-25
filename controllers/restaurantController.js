const pool = require("../config/db");
const { successResponse } = require("../utils/responseHandler");

// Add Restaurant
const addRestaurant = async (req, res) => {
  try {
	  console.log(req.body);
    const { name, location } = req.body;

    const result = await pool.query(
      "INSERT INTO restaurants (name, location) VALUES ($1, $2) RETURNING *",
      [name, location]
    );

    res.status(201).json({
      message: "Restaurant added successfully",
      restaurant: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Restaurants
const getRestaurants = async (req, res) => {
  try {
	  console.log(req.body);
    const result = await pool.query("SELECT * FROM restaurants");
    successResponse(res, result.rows, "restaurants fetched successfully");
	
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM restaurants WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addRestaurant, getRestaurants, getRestaurantById };