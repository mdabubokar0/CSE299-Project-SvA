import express from "express";
import {
  createPayment,
  executePayment,
  queryPayment,
  searchTransaction,
  refundTransaction,
} from "bkash-payment";
import { eventPayment, photographerPayment } from "../models/payment.model.js";
const router = express.Router();

const bkashConfig = {
  base_url: "bKash_base_url",
  username: "bkash_username",
  password: "bkash_password",
  app_key: "bkash_app_key",
  app_secret: "bkash_app_secret",
};

router.post("/bkash-checkout", async (req, res) => {
  try {
    const { amount, callbackURL, orderID, reference } = req.body;
    const paymentDetails = {
      amount: amount || 10,
      callbackURL: callbackURL || "http://localhost:8000/bkash-callback",
      orderID: orderID || "Order_101",
      reference: reference || "1",
    };
    const result = await createPayment(bkashConfig, paymentDetails);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

router.get("/bkash-callback", async (req, res) => {
  try {
    const { status, paymentID } = req.query;
    let result;
    let response = {
      statusCode: "4000",
      statusMessage: "Payment Failed",
    };
    if (status === "success")
      result = await executePayment(bkashConfig, paymentID);

    if (result?.transactionStatus === "Completed") {
      // database
    }
    if (result)
      response = {
        statusCode: result?.statusCode,
        statusMessage: result?.statusMessage,
      };
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

// Admin
router.post("/bkash-refund", async (req, res) => {
  try {
    const { paymentID, trxID, amount } = req.body;
    const refundDetails = {
      paymentID,
      trxID,
      amount,
    };
    const result = await refundTransaction(bkashConfig, refundDetails);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

router.get("/bkash-search", async (req, res) => {
  try {
    const { trxID } = req.query;
    const result = await searchTransaction(bkashConfig, trxID);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

router.get("/bkash-query", async (req, res) => {
  try {
    const { paymentID } = req.query;
    const result = await queryPayment(bkashConfig, paymentID);
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

// Save event payment
router.post("/event", eventPayment);

// Save photographer payment
router.post("/photographer", photographerPayment);

export default router;
