import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import { protectRoute } from "./middleware/authMiddleware.js";

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

// ✅ Routes
app.use("/api", userRoutes);
app.use("/profile", protectRoute, (req, res) => {
  const userId = req.user.id;
  console.log(userId); // userId should now be accessible
  res.json({ userId });
});


// ✅ Start Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
