import { pool } from "../config/db.js";

// Function to create a new event
export const createEvent = async (
  title,
  description,
  thumbnail,
  venue,
  date,
  capacity,
  ticket
) => {
  const query = `
      INSERT INTO event_info (title, description, thumbnail, venue, date, capacity, ticket)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  const values = [title, description, thumbnail, venue, date, capacity, ticket];

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
