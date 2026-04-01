require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

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

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email server error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

// ================= API =================
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    console.log("📩 Incoming data:", req.body);

    // 1. Save to MongoDB
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    // 2. Send Email
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // your domain email
      subject: "📩 New Contact Form Submission",
      text: `
New Inquiry Received:

Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${message}
      `,
    });

    res.status(201).json({
      message: "✅ Message sent & saved successfully",
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
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