import { pool } from "../config/db.js";

export const eventPayment = async (req, res) => {
  const { event_id, user_id, payment_method, mobile_number, transaction_id, amount } = req.body;

  try {
    // Save payment to the database
    const result = await pool.query(
      `INSERT INTO event_payment (event_id, user_id, payment_method, mobile_number, transaction_id, amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [event_id, user_id, payment_method, mobile_number, transaction_id, amount]
    );

    res.status(201).json({
      message: "Payment saved successfully",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Payment Save Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const photographerPayment = async (req, res) => {
  const { photographer_id, user_id, payment_method, mobile_number, transaction_id, amount, status } = req.body;

  try {
    // Save payment to the database
    const result = await pool.query(
      `INSERT INTO photographer_payment (photographer_id, user_id, payment_method, mobile_number, transaction_id, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [photographer_id, user_id, payment_method, mobile_number, transaction_id, amount, status]
    );

    res.status(201).json({
      message: "Payment successful",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Payment Save Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
