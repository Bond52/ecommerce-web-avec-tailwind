const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { message, email } = req.body;

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error("❌ BREVO_API_KEY manquante");
      return res.status(500).json({ success: false, error: "Configuration manquante." });
    }

    const payload = {
      sender: { name: "Sawaka Feedback", email: "contact@sawaka.org" },
      to: [
        { email: "contact@sawaka.org" } // tu reçois le message ici
      ],
      replyTo: { email: email || "contact@sawaka.org" },
      subject: "📝 Nouveau message d'un utilisateur",
      htmlContent: `
        <h2>Nouveau message depuis Sawaka</h2>
        <p><strong>Email utilisateur :</strong> ${email || "non fourni"}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📨 Email envoyé :", response.data);
    res.json({ success: true });

  } catch (error) {
    console.error("❌ Erreur Brevo API:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: "Impossible d'envoyer le message via Brevo."
    });
  }
});

module.exports = router;
