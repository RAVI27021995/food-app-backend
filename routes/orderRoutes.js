const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus
} = require("../controllers/orderController");


//without authetication token get and post 
// // Create order
// router.post("/", createOrder);
// // Get all orders for user
// router.get("/user/:userId", getUserOrders);
// // Get order details
// router.get("/:orderId", getOrderDetails);
// // Update order status
// router.put("/:orderId/status", updateOrderStatus);



const authMiddleware = require("../middleware/authMiddleware");

//  Create order
router.post("/", authMiddleware, createOrder);

//  Get logged-in user's orders
router.get("/user/me", authMiddleware, getUserOrders);

//  Get single order details
router.get("/:orderId", authMiddleware, getOrderDetails);

//  Update order status
router.put("/:orderId/status", authMiddleware, updateOrderStatus);

module.exports = router;





