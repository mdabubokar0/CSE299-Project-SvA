import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  createSuggestion,
  getSuggestions,
  deleteSuggestion,
  updateSuggestion,
} from "../models/suggestion.model.js"; // Import the model functions
import { protectRoute } from "../middleware/authMiddleware.js";
import { pool } from "../config/db.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route to create a new suggestion with thumbnail upload
router.post(
  "/create",
  protectRoute,
  upload.single("thumbnail"),
  async (req, res) => {
    try {
      const { title, price, type } = req.body;
      const thumbnail = req.file; // Get uploaded image

      if (!title || !price || !type) {
        return res
          .status(400)
          .json({ message: "Title, price, and type are required" });
      }

      const thumbnailUrl = `/uploads/${req.file.filename}`; // Local file path

      // Use createSuggestion to insert new suggestion into the database
      const newSuggestion = await createSuggestion(
        title,
        parseFloat(price), // Convert price to a number
        thumbnailUrl, // Save thumbnail path
        type
      );

      res.status(201).json({ message: "Suggestion created!", newSuggestion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to fetch all suggestions
router.get("/list", async (req, res) => {
  try {
    const suggestions = await getSuggestions(); // Use getSuggestions function
    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// Fetch paginated suggestions
router.get("/paginated-list", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10
    const offset = (page - 1) * limit; // Calculate offset

    // Fetch paginated suggestions
    const suggestionsQuery = await pool.query(
      "SELECT * FROM suggestion_info ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // Fetch total count of suggestions
    const countQuery = await pool.query("SELECT COUNT(*) FROM suggestion_info");

    res.json({
      suggestions: suggestionsQuery.rows,
      total: parseInt(countQuery.rows[0].count), // Total number of suggestions
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a suggestion by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSuggestion = await deleteSuggestion(id);
    if (!deletedSuggestion) {
      return res.status(404).json({ error: "Suggestion not found" });
    }
    res.json({ message: "Suggestion deleted successfully", deletedSuggestion });
  } catch (error) {
    console.error("Error deleting suggestion:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a suggestion by ID
router.patch("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, thumbnail, type } = req.body;

    const updatedSuggestion = await updateSuggestion(
      id,
      title,
      price,
      thumbnail,
      type
    );
    if (!updatedSuggestion) {
      return res.status(404).json({ error: "Suggestion not found" });
    }

    res.json({ message: "Suggestion updated successfully", updatedSuggestion });
  } catch (error) {
    console.error("Error updating suggestion:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
