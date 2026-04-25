const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { signupUser, loginUser } = require("../controllers/userController");
const { getUserProfile } = require("../controllers/userController");

// Signup route
router.post("/signup", signupUser);
// login route
router.post("/login", loginUser);

router.get("/me", authMiddleware, getUserProfile);

module.exports = router;