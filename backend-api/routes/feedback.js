const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { feedbackRecipients } = require("../config/feedback");

console.log("BREVO SMTP CONFIG:", {
  host: process.env.BREVO_SMTP_HOST,
  port: 465,
  user: process.env.BREVO_SMTP_USER,
  pass: process.env.BREVO_SMTP_PASS ? "✔️ PRESENT" : "❌ MISSING",
});

// === TRANSPORTEUR SMTP CORRIGÉ POUR RENDER ===
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: 465,              // IMPORTANT : SSL PORT
  secure: true,           // SSL ACTIVÉ
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// === ROUTE FEEDBACK ===
router.post("/", async (req, res) => {
  const { email, message } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Message vide" });
  }

  try {
    await transporter.sendMail({
      from: process.env.BREVO_SMTP_USER,
      to: feedbackRecipients,
      subject: "💬 Nouveau feedback Sawaka",
      text: `Email: ${email || "non fourni"}\nMessage:\n${message}`,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Erreur feedback SMTP:", err);
    return res.status(500).json({ success: false, error: "SMTP error" });
  }
});

module.exports = router;
