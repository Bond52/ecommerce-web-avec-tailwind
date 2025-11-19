const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Charger la config centralisée
const { feedbackRecipients } = require("../../app/config/feedback");

router.post("/", async (req, res) => {
  try {
    const { message, email } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message manquant" });
    }

    // Transporter mail (à personnaliser si besoin)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Préparer l'envoi
    const mailOptions = {
      from: email || "no-reply@sawaka.com",
      to: feedbackRecipients.join(","), // ← ✔ automatiquement depuis config
      subject: "Nouveau feedback Sawaka",
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Feedback envoyé avec succès" });
  } catch (err) {
    console.error("Erreur feedback :", err);
    res.status(500).json({ error: "Erreur lors de l’envoi du feedback" });
  }
});

module.exports = router;
