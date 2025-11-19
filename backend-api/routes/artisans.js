const express = require("express");
const router = express.Router();
const User = require("../models/user");

/**
 * 🎨 Récupère tous les artisans
 */
router.get("/", async (req, res) => {
  try {
    const artisans = await User.find({
      $or: [{ isSeller: true }, { roles: { $in: ["vendeur"] } }]
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du chargement des artisans" });
  }
});

/**
 * 🔎 Récupère 1 artisan par ID
 */
router.get("/:id", async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id).select("-password");

    if (!artisan) {
      return res.status(404).json({ message: "Artisan introuvable" });
    }

    res.json(artisan);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du chargement de l’artisan" });
  }
});

module.exports = router;
