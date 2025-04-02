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

// Update User
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure the user is authenticated
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { name, username, password } = req.body;

    // Check if at least one field is provided
    if (!name && !username && !password) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    // Build the query dynamically
    let query = "UPDATE users SET";
    let params = [];
    let updates = [];

    if (name) {
      updates.push(` name = $${params.length + 1} `);
      params.push(name);
    }
    if (username) {
      updates.push(` username = $${params.length + 1} `);
      params.push(username);
    }
    if (password) {
      updates.push(` password = $${params.length + 1} `);
      params.push(password); // Make sure to hash the password before storing!
    }

    query += updates.join(",");
    query += ` WHERE id = $${params.length + 1}`;
    params.push(userId);

    // Run the query
    await pool.query(query, params);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Tickets
export const getTicket = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT 
         ep.id AS ticket_id,
         ep.transaction_id,
         ep.amount,
         ep.payment_method,
         ep.mobile_number,
         ep.created_at AS purchase_date,
         u.name AS attendee_name,
         ei.title AS event_title,
         ei.date AS event_date,
         ei.venue AS event_venue,
         ei.ticket AS ticket_price,
         ei.thumbnail AS event_image
       FROM event_payment ep
       JOIN users u ON ep.user_id = u.id
       LEFT JOIN event_info ei ON ep.event_id = ei.id
       WHERE ep.user_id = $1 
       ORDER BY ep.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch tickets from database");
  }
};
