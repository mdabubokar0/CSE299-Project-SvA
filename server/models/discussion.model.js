import { pool } from "../config/db.js";

// Create a new discussion
export const createDiscussion = async (user_id, title, description) => {
  const result = await pool.query(
    "INSERT INTO discussion_info (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
    [user_id, title, description]
  );
  return result.rows[0];
};

// Get all discussions with user details
export const getAllDiscussions = async () => {
  const result = await pool.query(
    `SELECT di.*, u.name AS username 
     FROM discussion_info di 
     JOIN users u ON di.user_id = u.id 
     ORDER BY di.id DESC`
  );
  return result.rows;
};

// Search discussions by title
export const searchDiscussions = async (query) => {
  const result = await pool.query(
    `SELECT * FROM discussion_info WHERE title ILIKE $1 ORDER BY id DESC`,
    [`%${query}%`]
  );
  return result.rows;
};

// Check if discussion exists
export const discussionExists = async (discussion_id) => {
  const result = await pool.query(
    "SELECT id FROM discussion_info WHERE id = $1",
    [discussion_id]
  );
  return result.rows.length > 0;
};

// Delete discussion (only by creator)
export const deleteDiscussion = async (discussion_id, user_id) => {
  const result = await pool.query(
    "SELECT * FROM discussion_info WHERE id = $1 AND user_id = $2",
    [discussion_id, user_id]
  );

  if (result.rows.length === 0) return false;

  await pool.query("DELETE FROM discussion_info WHERE id = $1", [
    discussion_id,
  ]);
  return true;
};

// Add a comment to a discussion
export const addComment = async (discussion_id, user_id, comment) => {
  const result = await pool.query(
    "INSERT INTO discussion_comment (discussion_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
    [discussion_id, user_id, comment]
  );
  return result.rows[0];
};

// Get all comments for a discussion
export const getDiscussionComments = async (discussion_id) => {
  const result = await pool.query(
    `SELECT dc.comment, u.username, dc.created_at 
       FROM discussion_comment dc 
       JOIN users u ON dc.user_id = u.id 
       WHERE dc.discussion_id = $1 
       ORDER BY dc.created_at DESC`,
    [discussion_id]
  );
  return result.rows;
};

// Update a discussion (only by creator)
export const updateDiscussion = async (
  discussion_id,
  user_id,
  title,
  description
) => {
  // Check if discussion exists and belongs to the user
  const result = await pool.query(
    "SELECT * FROM discussion_info WHERE id = $1 AND user_id = $2",
    [discussion_id, user_id]
  );

  if (result.rows.length === 0) return false; // User doesn't own the discussion

  // Update the discussion
  await pool.query(
    "UPDATE discussion_info SET title = $1, description = $2 WHERE id = $3",
    [title, description, discussion_id]
  );

  return true; // Successfully updated
};
