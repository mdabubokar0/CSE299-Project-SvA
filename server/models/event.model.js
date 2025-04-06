import { pool } from "../config/db.js";

// Function to create a new event
export const createEvent = async (
  title,
  description,
  thumbnail,
  venue,
  date,
  capacity,
  ticket,
  category
) => {
  const query = `
      INSERT INTO event_info (title, description, thumbnail, venue, date, capacity, ticket, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

  const values = [
    title,
    description,
    thumbnail,
    venue,
    date,
    capacity,
    ticket,
    category,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getEvents = async () => {
  try {
    const result = await pool.query("SELECT * FROM event_info");
    return result.rows;
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error; // Propagate error
  }
};

// Delete an event by ID
export const deleteEvent = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM event_info WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0]; // Return the deleted event
  } catch (error) {
    console.error("Error deleting event:", error.message);
    throw error;
  }
};

// Update an event by ID
export const updateEvent = async (
  id,
  title,
  description,
  thumbnail,
  venue,
  date,
  capacity,
  ticket
) => {
  try {
    const result = await pool.query(
      `UPDATE event_info
         SET title = $1, description = $2, thumbnail = $3,
             venue = $4, date = $5, capacity = $6, ticket = $7
         WHERE id = $8
         RETURNING *`,
      [title, description, thumbnail, venue, date, capacity, ticket, id]
    );
    return result.rows[0]; // Return the updated event
  } catch (error) {
    console.error("Error updating event:", error.message);
    throw error;
  }
};

// Get purchased events for user
export const getPurchasedEvents = async (userId) => {
  try {
    if (isNaN(parseInt(userId))) throw new Error("Invalid User ID");

    const result = await pool.query(
      `SELECT DISTINCT ei.* 
       FROM event_info ei
       JOIN event_payment ep ON ei.id = ep.event_id
       WHERE ep.user_id = $1
       ORDER BY ei.date DESC`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error("Database Error - getPurchasedEvents:", error);
    throw new Error("Failed to fetch purchased events from database");
  }
};

// Function to get a single event by ID
export const getEventById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM event_info WHERE id = $1", [
      id,
    ]);

    // If no event found, return null
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching event by ID:", error.message);
    throw error; // Propagate error
  }
};

// Function to search events by title using ILIKE
export const searchEventsByTitle = async (query) => {
  try {
    const result = await pool.query(
      `SELECT * FROM event_info WHERE title ILIKE $1 ORDER BY id DESC`,
      [`%${query}%`]
    );
    return result.rows;
  } catch (error) {
    console.error("Error searching events:", error.message);
    throw error;
  }
};
