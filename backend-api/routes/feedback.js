const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { feedbackRecipients } = require("../config/feedback");
require("dotenv").config();

// Transporteur SMTP Brevo
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false, // Brevo utilise STARTTLS sur le port 587
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Message requis" });
    }

    // Email
    const info = await transporter.sendMail({
      from: `"Sawaka Feedback" <${process.env.BREVO_SMTP_USER}>`,
      to: feedbackRecipients.join(","),
      subject: "📝 Nouveau feedback utilisateur",
      text: message,
      html: `<p>${message}</p>`,
    });

    console.log("✉️ Email envoyé :", info.messageId);

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur Feedback:", error);
    res.status(500).json({ success: false, error: "Erreur envoi email" });
  }
});

module.exports = router;
