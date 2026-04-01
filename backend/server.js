require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err.message));

// Schema
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

// ================= API =================
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("📩 Incoming data:", req.body);

    // 1. Save to MongoDB
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    // 2. Send Email using Resend
    const response = await resend.emails.send({
      from: "Tridalworld <contact@tridalworld.com>",
      to: "contact@tridalworld.com",
      subject: "📩 New Contact Form Submission",
      text: `
New Inquiry Received:

Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${message}
      `,
    });

    console.log("📧 Resend Response:", response);

    res.status(201).json({
      message: "✅ Message sent & saved successfully",
    });

  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({
      message: "❌ Something went wrong",
    });
  }
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});