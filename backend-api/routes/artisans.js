const express = require("express");
const router = express.Router();
const User = require("../models/user");

/**
 * 🎨 Récupère tous les artisans (vendeurs)
 */
router.get("/", async (req, res) => {
  try {
    const artisans = await User.find({
      $or: [
        { isSeller: true },
        { roles: { $in: ["vendeur"] } }
      ]
    })
      .select("-password")
      .sort({ createdAt: -1 });

    if (!artisans.length) {
      console.warn("⚠️ Aucun artisan trouvé dans la base");
      return res.status(200).json([]);
    }

    res.json(artisans);
  } catch (err) {
    console.error("❌ Erreur /api/artisans :", err.message);
    res.status(500).json({ message: "Erreur lors du chargement des artisans" });
  }
});

module.exports = router;
