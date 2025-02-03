import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, username, password, role]
    );

    // Generate JWT token
    const token = jwt.sign({ id: newUser.rows[0].id, username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords (plain text check)
    if (password !== user.rows[0].password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const { id, role } = user.rows[0];

    // Generate JWT token including role
    const token = jwt.sign({ id, username, role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: user.rows[0],
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
