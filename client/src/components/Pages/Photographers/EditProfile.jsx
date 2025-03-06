import React, { useState } from "react";
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Create a photographer
app.post("/photographers", upload.single("picture"), async (req, res) => {
  try {
    const { nid, id, bio, contact_no, experience, camera_model, hourly_charge } = req.body;
    const picture = req.file ? req.file.path : null;

    const newPhotographer = await pool.query(
      "INSERT INTO photographer (nid, id, picture, bio, contact_no, experience, camera_model, hourly_charge) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [nid, id, picture, bio, contact_no, experience, camera_model, hourly_charge]
    );

    res.json(newPhotographer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get photographer by ID
app.get("/photographers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await pool.query("SELECT * FROM photographer WHERE id = $1", [id]);

    if (photographer.rows.length === 0) {
      return res.status(404).json({ message: "Photographer not found" });
    }

    res.json(photographer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update photographer details
app.put("/photographers/:id", upload.single("picture"), async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, contact_no, experience, camera_model, hourly_charge } = req.body;
    const picture = req.file ? req.file.path : null;

    const updatedPhotographer = await pool.query(
      "UPDATE photographer SET picture = COALESCE($1, picture), bio = COALESCE($2, bio), contact_no = COALESCE($3, contact_no), experience = COALESCE($4, experience), camera_model = COALESCE($5, camera_model), hourly_charge = COALESCE($6, hourly_charge) WHERE id = $7 RETURNING *",
      [picture, bio, contact_no, experience, camera_model, hourly_charge, id]
    );

    if (updatedPhotographer.rows.length === 0) {
      return res.status(404).json({ message: "Photographer not found" });
    }

    res.json(updatedPhotographer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const PhotographerSettings = () => {
  const [formData, setFormData] = useState({
    nid: "",
    id: "",
    bio: "",
    cameraModel: "",
    hourlyCharge: "",
    experience: "",
    contactNo: "",
    picture: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, picture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call to save data
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-6 flex flex-col justify-between">
        <h1 className="text-2xl font-bold">EVENTLY</h1>
        <nav>
          <ul>
            <li className="py-2">Dashboard</li>
            <li className="py-2">Hiring</li>
            <li className="py-2 bg-white rounded-md shadow">Settings</li>
          </ul>
        </nav>
        <button className="text-black-600">Logout</button>
      </div>

     
      <div className="w-3/4 p-10">
        <div className="flex flex-col items-center">
          
          <div className="relative w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
            {formData.picture ? (
              <img
                src={URL.createObjectURL(formData.picture)}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500">Upload</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          {/* Form */}
          <form className="mt-6 w-1/2 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nid"
              placeholder="NID"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="id"
              placeholder="ID"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Bio"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="number"
              name="hourlyCharge"
              placeholder="Remuneration (per hour)"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="number"
              name="experience"
              placeholder="Experience"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="cameraModel"
              placeholder="Camera Model"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="contactNo"
              placeholder="Contact No"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhotographerSettings;
