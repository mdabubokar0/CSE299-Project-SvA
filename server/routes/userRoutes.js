import express from "express";
import { pool } from "../config/db.js";
import { registerUser, loginUser } from "../models/auth.model.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router(); // ✅ Correctly initialize the router

router.post("/register", registerUser);
router.post("/login", loginUser);

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
    const userId = req.user.id; // Extract user ID from the decoded JWT stored in req.user

    // Check if userId is present; if not, return a 400 Bad Request response
    if (!userId) {
      return res.status(400).json({ error: "User  ID not found in token" });
    }

    // Query to get the user's name from the database using the user ID
    const result = await pool.query(
      "SELECT name FROM users WHERE id = $1", // SQL query to select the name
      [userId] // Parameterized query to prevent SQL injection
    );

    // Check if any rows were returned; if not, return a 404 Not Found response
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User  not found" });
    }

    // Send a JSON response containing the user's name
    res.json({ name: result.rows[0].name }); // Send the user's name as a response
  } catch (error) {
    // Log the error message to the console for debugging purposes
    console.error("❌ Error fetching name:", error.message);
    // Send a 500 Internal Server Error response if an error occurs
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

export default router;
