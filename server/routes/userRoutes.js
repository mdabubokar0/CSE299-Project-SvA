import express from "express";
import { pool } from "../config/db.js";
import {
  registerUser,
  loginUser,
  updateUser,
  getTicket,
} from "../models/auth.model.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router(); // Correctly initialize the router

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update", protectRoute, updateUser);

// Select all users with pagination
router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10
    const offset = (page - 1) * limit; // Calculate offset

    // Fetch paginated users
    const usersQuery = await pool.query(
      "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // Fetch total count of users
    const countQuery = await pool.query("SELECT COUNT(*) FROM users");

    res.json({
      users: usersQuery.rows,
      total: parseInt(countQuery.rows[0].count), // Total number of users
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch user name
router.get("/profile", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    // Fetch both name and username
    const result = await pool.query(
      "SELECT name, username FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send both name and username
    res.json({
      name: result.rows[0].name,
      username: result.rows[0].username, // Add username to the response
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Organizer Count
router.get("/organizer/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = $1",
      ["organizer"]
    );
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching organizer count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Photographer Count
router.get("/photographer/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = $1",
      ["photographer"]
    );
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching photographer count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Attendee Count
router.get("/attendee/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = $1",
      ["attendee"]
    );
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching attendee count:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all tickets for authenticated user
router.get("/ticket", protectRoute, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const tickets = await getTicket(userId);

    res.status(200).json({
      success: true,
      tickets: tickets || [], // Returns empty array if no tickets
    });

  } catch (error) {
    console.error("Ticket Fetch Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
});

export default router;
