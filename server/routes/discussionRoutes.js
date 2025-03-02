import express from "express";
import { pool } from "../config/db.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Discussion
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    const user_id = req.user.id;
    const result = await pool.query(
      "INSERT INTO discussion_info (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Comment on Discussion
router.post("/:discussion_id/comment", protectRoute, async (req, res) => {
  try {
    const { comment } = req.body;
    const { discussion_id } = req.params;
    const user_id = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    // Ensure discussion exists before commenting
    const discussionExists = await pool.query(
      "SELECT id FROM discussion_info WHERE id = $1",
      [discussion_id]
    );

    if (discussionExists.rows.length === 0) {
      return res.status(404).json({ message: "Discussion not found." });
    }

    const result = await pool.query(
      "INSERT INTO discussion_comment (discussion_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
      [discussion_id, user_id, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all discussions (newest first)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT di.*, u.name AS username 
             FROM discussion_info di 
             JOIN users u ON di.user_id = u.id 
             ORDER BY di.id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Search Discussions by title (using ILIKE)
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const result = await pool.query(
      `SELECT * FROM discussion_info WHERE title ILIKE $1 ORDER BY id DESC`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error searching discussions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Discussion (Only creator)
router.delete("/:discussion_id", protectRoute, async (req, res) => {
  try {
    const { discussion_id } = req.params;
    const user_id = req.user.id;

    // Check if user is the creator
    const discussion = await pool.query(
      "SELECT * FROM discussion_info WHERE id = $1 AND user_id = $2",
      [discussion_id, user_id]
    );

    if (discussion.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this discussion." });
    }

    await pool.query("DELETE FROM discussion_info WHERE id = $1", [
      discussion_id,
    ]);
    res.json({ message: "Discussion deleted successfully." });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT discussion_comment.comment, users.username, discussion_comment.created_at FROM discussion_comment JOIN users ON discussion_comment.user_id = users.id WHERE discussion_comment.discussion_id = $1 ORDER BY discussion_comment.created_at DESC",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch discussion_comment" });
  }
});

export default router;
