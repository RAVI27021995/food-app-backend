const pool = require("../config/db");
const { successResponse } = require("../utils/responseHandler");

// Add Menu Item
const addMenuItem = async (req, res) => {
  try {
	  console.log(req.body);
    const { restaurant_id, name, description, price } = req.body;

    if (!restaurant_id || !name || !price) {
      //return res.status(400).json({ message: "Required fields missing" });
	  throw new Error("Required fields missing");
    }

    const result = await pool.query(
      `INSERT INTO menu_items (restaurant_id, name, description, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [restaurant_id, name, description, price]
    );
	console.log(result.rows);

    res.status(201).json({
      message: "Menu item added",
      item: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get Menu by Restaurant
const getMenuByRestaurant = async (req, res) => {
  try {
	  console.log(req.body);
    const { restaurantId } = req.params;

    const result = await pool.query(
      "SELECT * FROM menu_items WHERE restaurant_id = $1",
      [restaurantId]
    );
	console.log(result.rows);

    successResponse(res, result.rows, "restaurants menu fetched successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMenuItem, getMenuByRestaurant };