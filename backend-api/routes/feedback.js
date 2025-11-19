const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { message, email } = req.body;

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error("❌ BREVO_API_KEY manquant");
      return res.status(500).json({ success: false, error: "Configuration manquante." });
    }

    const payload = {
      sender: { name: "Sawaka Feedback", email: "no-reply@sawaka.com" },
      to: [
        { email: "bertrand.ond@gmail.com" },
        { email: "test2@sawaka.com" }
      ],
      subject: "📝 Nouveau feedback Sawaka",
      htmlContent: `
        <h2>Nouveau message d'un utilisateur</h2>
        <p><strong>Email :</strong> ${email || "non fourni"}</p>
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
