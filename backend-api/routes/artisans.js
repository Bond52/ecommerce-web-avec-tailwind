const express = require("express");
const router = express.Router();
const User = require("../models/user"); // 👈 même casse que dans admin.js

/**
 * 🧵 Route publique pour lister les artisans
 * Renvoie uniquement les utilisateurs avec le rôle vendeur/vendor
 */
router.get("/", async (req, res) => {
  try {
    const artisans = await User.find({
      $or: [
        { role: "vendeur" },
        { role: "vendor" },
        { roles: { $in: ["vendeur", "vendor"] } } // si certains users ont un tableau de rôles
      ]
    }).select("-password");

    if (!artisans.length) {
      return res.status(404).json({ message: "Aucun artisan trouvé" });
    }

    res.json(artisans);
  } catch (err) {
    console.error("Erreur /api/artisans :", err.message);
    res.status(500).json({ message: "Erreur lors du chargement des artisans" });
  }
});

module.exports = router;
