import { pool } from "../config/db.js";

// Function to create a new photographer
export const createPhotographer = async (
  nid,
  id,
  picture,
  bio,
  contact_no,
  experience,
  camera_model,
  hourly_charge
) => {
  const query = `
      INSERT INTO photographer_info (nid, id, picture, bio, contact_no, experience, camera_model, hourly_charge)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

  const values = [
    nid,
    id,
    picture,
    bio,
    contact_no,
    experience,
    camera_model,
    hourly_charge,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Function to fetch all photographers with their names
export const getPhotographers = async () => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as photographer_name 
       FROM photographer_info p
       JOIN users u ON p.id = u.id`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching photographers:", error.message);
    throw error;
  }
};

// Function to fetch a single photographer by ID with their name
export const getPhotographerById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as photographer_name 
       FROM photographer_info p
       JOIN users u ON p.id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching photographer by ID:", error.message);
    throw error;
  }
};
