import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import eventRoutes from "./routes/eventRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import photographerRoutes from "./routes/photographerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://172.20.10.2:8082", "http://192.168.10.151:8082"],
    credentials: true,
  })
);

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Files (For Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", userRoutes); // Routes
app.use("/event", eventRoutes); // Event Routes
app.use("/discussion", discussionRoutes); // Discussion Routes
app.use("/photographer", photographerRoutes); // Photographer Routes
app.use("/payment", paymentRoutes); // Payment Routes
app.use("/suggestion", productRoutes); // Suggestion Routes

app.get('/generate-qr/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params;

  // Generate a link using the transaction ID
  const url = `https://yourwebsite.com/transaction/${transaction_id}`;

  try {
    // Generate the QR code as a data URL (base64 encoded)
    const qrCodeUrl = await QRCode.toDataURL(url);
    res.json({ qrCodeUrl });
  } catch (error) {
    res.status(500).send('Error generating QR code');
  }
});

// Start Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`- Server running on port ${PORT}`);
});
