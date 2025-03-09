import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  createPhotographer,
  getPhotographers,
  getPhotographerById,
} from "../models/photographer.model.js"; // Import the model functions
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route to create a new photographer with image upload
router.post(
  "/create",
  protectRoute,
  upload.single("picture"),
  async (req, res) => {
    try {
      const { nid, bio, contact_no, experience, camera_model, hourly_charge } =
        req.body;
      const picture = req.file; // Get uploaded image

      if (
        !nid ||
        !bio ||
        !contact_no ||
        !experience ||
        !camera_model ||
        !hourly_charge
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // User ID from JWT
      const userId = req.user.id; // Extract logged-in user ID from token

      const pictureUrl = `/uploads/${req.file.filename}`; // Local file path

      // Use createPhotographer to insert new photographer into the database
      const newPhotographer = await createPhotographer(
        nid,
        userId, // Associate photographer with logged-in user
        pictureUrl, // Save image path
        bio,
        contact_no,
        experience,
        camera_model,
        hourly_charge
      );

      res
        .status(201)
        .json({ message: "Photographer profile created!", newPhotographer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to fetch all photographers
router.get("/list", async (req, res) => {
  try {
    const photographers = await getPhotographers(); // Use getPhotographers function
    res.json(photographers);
  } catch (error) {
    console.error("Error fetching photographers:", error.message);
    res.status(500).json({ error: "Failed to fetch photographers" });
  }
});

// Route to fetch a single photographer by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await getPhotographerById(id); // Use getPhotographerById function

    if (!photographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    res.json(photographer);
  } catch (error) {
    console.error("Error fetching photographer:", error.message);
    res.status(500).json({ error: "Failed to fetch photographer" });
  }
});

export default router;
