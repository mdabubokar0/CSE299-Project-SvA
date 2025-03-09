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

  const values = [title, description, thumbnail, venue, date, capacity, ticket, category];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getEvents = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM event_info"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw error; // Propagate error
  }
};


// Function to get a single event by ID
export const getEventById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM event_info WHERE id = $1",
      [id]
    );

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