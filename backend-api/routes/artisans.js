const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/artisans → liste des vendeurs
router.get("/", async (req, res) => {
  try {
    const artisans = await User.find({ role: { $in: ["vendor", "vendeur"] } })
      .select("-password") // on cache le mot de passe
      .sort({ createdAt: -1 }); // tri du plus récent au plus ancien

    res.json(artisans);
  } catch (error) {
    console.error("Erreur récupération artisans:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
