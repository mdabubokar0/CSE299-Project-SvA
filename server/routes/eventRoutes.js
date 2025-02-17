import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createEvent, getEvents } from "../models/event.model.js";

const router = express.Router();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration (Local Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store images in "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route to Create an Event with Image Upload
router.post("/create", upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, venue, date, capacity, ticket } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Thumbnail is required" });
    }

    const thumbnailUrl = `/uploads/${req.file.filename}`; // Local file path

    console.log("📸 Uploaded file:", req.file); // Debugging

    const newEvent = await createEvent(
      title,
      description,
      thumbnailUrl,
      venue,
      date,
      capacity,
      ticket
    );

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("❌ Error creating event:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch all events
router.get("/list", async (req, res) => {
  try {
    const events = await getEvents(); // Fetch events from the model
    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching events:", error.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Export Router
export default router;
