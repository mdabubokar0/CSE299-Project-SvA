const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const { Payment } = require("../models/payment.model.js");

const router = express.Router();

const store_id = "your_store_id";
const store_passwd = "your_store_password";
const is_live = false; // Set to true in production

// Initiate payment
router.post("/initiate", async (req, res) => {
  const { event_id, user_id, amount } = req.body;
  const transaction_id = "txn_" + new Date().getTime();

  try {
    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id: transaction_id,
      success_url: "http://localhost:8081/payment/success",
      fail_url: "http://localhost:8081/payment/fail",
      cancel_url: "http://localhost:8081/payment/cancel",
      ipn_url: "http://localhost:8081/payment/ipn",
      product_name: "Event Ticket",
      cus_name: "Customer Name",
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_phone: "017xxxxxxxx",
    };

    // Save initial payment as "Pending"
    await Payment.create({
      transaction_id,
      event_id,
      user_id,
      amount,
      status: "Pending",
    });

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      res.json({ GatewayPageURL: apiResponse.GatewayPageURL });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment initiation failed." });
  }
});

// Success Route
router.post("/success", async (req, res) => {
  const { tran_id } = req.body;

  try {
    await Payment.update(
      { status: "Success" },
      { where: { transaction_id: tran_id } }
    );
    res.redirect("http://localhost:3000/payment-success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating payment status." });
  }
});

// Failure Route
router.post("/fail", async (req, res) => {
  const { tran_id } = req.body;
  await Payment.update(
    { status: "Failed" },
    { where: { transaction_id: tran_id } }
  );
  res.redirect("http://localhost:3000/payment-fail");
});

// Cancel Route
router.post("/cancel", async (req, res) => {
  const { tran_id } = req.body;
  await Payment.update(
    { status: "Failed" },
    { where: { transaction_id: tran_id } }
  );
  res.redirect("http://localhost:3000/payment-cancel");
});

module.exports = router;
