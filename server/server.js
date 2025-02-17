import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import eventRoutes from "./routes/eventRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Files (For Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", userRoutes); // ✅ Routes
app.use("/event", eventRoutes); // Event Routes

// ✅ Start Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
