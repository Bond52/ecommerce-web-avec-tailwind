const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { feedbackRecipients } = require("../config/feedback");

router.post("/", async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({ success: false, error: "Message trop court" });
    }

    // Transporter SMTP (Brevo)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Brevo = false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email à toi
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: feedbackRecipients.join(","),
      subject: "🟠 Nouveau feedback Sawaka",
      text: `Email: ${email || "Anonyme"}\n\nMessage:\n${message}`,
    });

    return res.json({ success: true, message: "Feedback envoyé !" });
  } catch (err) {
    console.error("Erreur feedback:", err);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur (envoi impossible)",
    });
  }
});

module.exports = router;
