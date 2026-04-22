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

    // 2. Send Email using Nodemailer
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net", // Typical GoDaddy SMTP server. Change to mail.tridalworld.com if this fails.
      port: 465, // SSL
      secure: true,
      auth: {
        user: "aditya@tridalworld.com",
        pass: "8707615640",
      },
    });

    const mailOptions = {
      from: "aditya@tridalworld.com", // Must match the authenticated user
      to: "aditya@tridalworld.com", // The email receiving the inquiries
      subject: "📩 New Tridalworld Inquiry",
      text: `
You have a new inquiry from the website!

Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.response);

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