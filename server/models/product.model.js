import { pool } from "../config/db.js";

// Function to create a new suggestion
export const createProduct = async (title, price, thumbnail, type) => {
  const query = `
    INSERT INTO product_info (title, price, thumbnail, type)
    VALUES ($1, $2, $3, $4) RETURNING *`;

  const values = [title, price, thumbnail, type];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating suggestion:", error.message);
    throw error;
  }
};

// Function to fetch all suggestions
export const getProducts = async () => {
  try {
    const result = await pool.query(`SELECT * FROM product_info`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    throw error;
  }
};

// Delete a suggestion by ID
export const deleteProduct = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM product_info WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0]; // Return the deleted suggestion
  } catch (error) {
    console.error("Error deleting suggestion:", error.message);
    throw error;
  }
};

// Update a suggestion by ID
export const updateProduct = async (id, title, price, thumbnail, type) => {
  try {
    const result = await pool.query(
      `UPDATE product_info
         SET title = $1, price = $2, thumbnail = $3, type = $4
         WHERE id = $5
         RETURNING *`,
      [title, price, thumbnail, type, id]
    );
    return result.rows[0]; // Return the updated suggestion
  } catch (error) {
    console.error("Error updating suggestion:", error.message);
    throw error;
  }
};
