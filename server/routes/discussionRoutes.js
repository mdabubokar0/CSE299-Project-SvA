import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createDiscussion,
  getAllDiscussions,
  searchDiscussions,
  discussionExists,
  deleteDiscussion,
  addComment,
  getDiscussionComments,
  updateDiscussion,
} from "../models/discussion.model.js";

const router = express.Router();

// ✅ Create Discussion
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    const discussion = await createDiscussion(req.user.id, title, description);
    res.status(201).json(discussion);
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get All Discussions
router.get("/", async (req, res) => {
  try {
    const discussions = await getAllDiscussions();
    res.json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Search Discussions
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required." });

    const discussions = await searchDiscussions(query);
    res.json(discussions);
  } catch (error) {
    console.error("Error searching discussions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Add Comment to Discussion
router.post("/:discussion_id/comment", protectRoute, async (req, res) => {
  try {
    const { comment } = req.body;
    const { discussion_id } = req.params;
    const user_id = req.user.id;

    if (!comment)
      return res.status(400).json({ message: "Comment cannot be empty." });

    // Ensure discussion exists
    if (!(await discussionExists(discussion_id))) {
      return res.status(404).json({ message: "Discussion not found." });
    }

    const newComment = await addComment(discussion_id, user_id, comment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get Comments for Discussion
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await getDiscussionComments(id);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// ✅ Delete Discussion (Only Creator)
router.delete("/:discussion_id", protectRoute, async (req, res) => {
  try {
    const { discussion_id } = req.params;
    const user_id = req.user.id;

    const deleted = await deleteDiscussion(discussion_id, user_id);
    if (!deleted)
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this discussion." });

    res.json({ message: "Discussion deleted successfully." });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit a discussion post
router.patch("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const user_id = req.user.id; // Extract user ID from token

  const success = await updateDiscussion(id, user_id, title, description);

  if (!success) {
    return res
      .status(403)
      .json({ message: "Unauthorized or discussion not found" });
  }

  res.json({ message: "Discussion updated successfully" });
});

export default router;
