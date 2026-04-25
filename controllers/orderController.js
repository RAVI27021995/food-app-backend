const pool = require("../config/db");
const { successResponse } = require("../utils/responseHandler");

// ✅ Create Order
const createOrder = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
	

    const user_id = req.user.id;
    //const { items } = req.body;
	const { items, address } = req.body;
	console.log("ADDRESS:", address);

    if (!user_id || !items || items.length === 0) {
      throw new Error("Invalid order data");
    }

    let totalPrice = 0;

    // ✅ Calculate total price
    for (let item of items) {
      const menuItem = await pool.query(
        "SELECT price FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      );

      if (menuItem.rows.length === 0) {
        throw new Error("Invalid menu item");
      }

      const price = menuItem.rows[0].price;
      totalPrice += price * item.quantity;
    }

    // ✅ Insert order
    // const orderResult = await pool.query(
      // "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      // [user_id, totalPrice]
    // );
	
	
	
	const orderResult = await pool.query(
		"INSERT INTO orders (user_id, total_price, address) VALUES ($1, $2, $3) RETURNING id",
		[user_id, totalPrice, address]
		);

    const orderId = orderResult.rows[0].id;

    // ✅ Insert order items
    for (let item of items) {
      const menuItem = await pool.query(
        "SELECT price FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      );

      const price = menuItem.rows[0].price;

      await pool.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.menu_item_id, item.quantity, price]
      );
    }

    // ✅ Final response (ONLY ONCE)
    res.status(201).json({
      message: "Order created successfully",
      orderId,
      totalPrice,
    });

  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all orders for logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; //  from JWT

    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const result = await pool.query(
      `SELECT 
         oi.id,
         oi.quantity,
         oi.price,
         mi.name AS item_name,
         mi.description
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.order_id = $1 AND o.user_id = $2`,
      [orderId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    successResponse(res, result.rows, "Order details fetched successfully");

  } catch (error) {
    console.error("Order Details Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["placed", "preparing", "delivered"];

    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order: result.rows[0],
    });

  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
};