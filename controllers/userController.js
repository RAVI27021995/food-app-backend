const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse } = require("../utils/responseHandler");

// Signup Controller
const signupUser = async (req, res) => {
  try {
	  console.log(req.body);
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
	console.log("User Exists Check:", userExists.rows);

    if (userExists.rows.length > 0) {
      //return res.status(400).json({ message: "User already exists" });
	  throw new Error("User already exists");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
	console.log("New User:", newUser.rows);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  }catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};



// Login Controller
const loginUser = async (req, res) => {
  try {
	  console.log(req.body);
    const { email, password } = req.body;

    // Check user exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
	console.log("User Result:", userResult.rows);

    if (userResult.rows.length === 0) {
     // return res.status(400).json({ message: "Invalid credentials" });
	    throw new Error("Invalid credentials");
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      //return res.status(400).json({ message: "Invalid credentials" });
	  throw new Error("Invalid credentials");
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { signupUser, loginUser, getUserProfile };