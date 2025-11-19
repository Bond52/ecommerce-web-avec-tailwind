// backend-api/routes/feedback.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { feedbackRecipients } = require("../config/feedback");

router.post("/", async (req, res) => {
  try {
    const { message, email } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({ success: false, msg: "Message trop court" });
    }



console.log("BREVO SMTP CONFIG:", {
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  user: process.env.BREVO_SMTP_USER,
  pass: process.env.BREVO_SMTP_PASS ? "✔️ PRESENT" : "❌ ABSENT"
});



    // 🔥 Config SMTP Brevo via Render ENV
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: 465, // IMPORTANT : port SSL
  secure: true, // SSL obligatoire pour Brevo sur ce port
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }
});


    await transporter.sendMail({
      from: process.env.BREVO_SMTP_USER,
      to: feedbackRecipients.join(", "),
      subject: "🛠 Nouveau feedback Sawaka",
      text: `Email: ${email || "Non fourni"}\n\nMessage:\n${message}`,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Erreur feedback SMTP:", err);
    return res
      .status(500)
      .json({ success: false, msg: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
