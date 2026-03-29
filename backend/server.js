require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err.message));

// Schema (INSIDE server.js)
const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

// API
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const contact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message,
    });

    await contact.save();

    res.status(201).json({ message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error("CONTACT SAVE ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});


// Test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
