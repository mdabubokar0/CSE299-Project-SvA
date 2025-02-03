import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./config/db.js";
import { registerUser, loginUser } from "./models/auth.model.js";
import { protectRoute } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Public Routes
app.post("/api/register", registerUser);
app.post("/api/login", loginUser);

// Protected Route Example
app.get("/api/profile", protectRoute, async (req, res) => {
  try {
    const user = await pool.query("SELECT id, name, username FROM users WHERE id = $1", [req.user.id]);
    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
