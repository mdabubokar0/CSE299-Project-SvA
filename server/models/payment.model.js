import { pool } from "../config/db.js";

export const eventPayment = async (req, res) => {
  // Get user_id from authenticated user instead of request body
  const { event_id, payment_method, mobile_number, transaction_id, amount } =
    req.body;
  const user_id = req.user?.id; // From authentication middleware

  if (!user_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized - User not authenticated" });
  }

  try {
    // Save payment to the database
    const result = await pool.query(
      `INSERT INTO event_payment (event_id, user_id, payment_method, mobile_number, transaction_id, amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [event_id, user_id, payment_method, mobile_number, transaction_id, amount]
    );

    res.status(201).json({
      success: true,
      message: "Payment saved successfully",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Payment Save Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const photographerPayment = async (req, res) => {
  // Get user_id from authenticated user instead of request body
  const {
    photographer_id,
    payment_method,
    mobile_number,
    transaction_id,
    amount,
    status,
  } = req.body;
  const user_id = req.user?.id; // From authentication middleware

  if (!user_id) {
    return res
      .status(401)
      .json({ error: "Unauthorized - User not authenticated" });
  }

  try {
    // Save payment to the database
    const result = await pool.query(
      `INSERT INTO photographer_payment (photographer_id, user_id, payment_method, mobile_number, transaction_id, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        photographer_id,
        user_id,
        payment_method,
        mobile_number,
        transaction_id,
        amount,
        status || "pending",
      ] // Default status
    );

    res.status(201).json({
      success: true,
      message: "Payment successful",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Payment Save Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
