const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Association ville → région
const REGIONS = {
  "Yaoundé": "Centre",
  "Mbalmayo": "Centre",
  "Obala": "Centre",

  "Douala": "Littoral",
  "Nkongsamba": "Littoral",
  "Yabassi": "Littoral",

  "Bafoussam": "Ouest",
  "Dschang": "Ouest",
  "Foumban": "Ouest",

  "Garoua": "Nord",
  "Guider": "Nord",
  "Pitoa": "Nord",

  "Maroua": "Extrême-Nord",
  "Kousséri": "Extrême-Nord",
  "Mora": "Extrême-Nord",

  "Ebolowa": "Sud",
  "Kribi": "Sud",
  "Sangmélima": "Sud",

  "Bertoua": "Est",
  "Batouri": "Est",
  "Abong-Mbang": "Est",

  "Bamenda": "Nord-Ouest",
  "Kumbo": "Nord-Ouest",
  "Ndop": "Nord-Ouest",

  "Buea": "Sud-Ouest",
  "Limbe": "Sud-Ouest",
  "Kumba": "Sud-Ouest",

  "Ngaoundéré": "Adamaoua",
  "Meiganga": "Adamaoua",
  "Tibati": "Adamaoua"
};

// GET /stats/artisans-par-region
router.get("/artisans-par-region", async (req, res) => {
  try {
    // On récupère uniquement les vendeurs
    const artisans = await User.find(
      { roles: { $in: ["vendeur"] } },
      { city: 1 }
    );

    let counts = {};

    for (const art of artisans) {
      if (!art.city) continue;

      // Normalize: enlever accents + maj/min
      const ville = art.city.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

      // Trouver la région correspondante
      const region = REGIONS[ville] || null;
      if (!region) continue;

      counts[region] = (counts[region] || 0) + 1;
    }

    res.json(counts);

  } catch (err) {
    console.error("Erreur dans /artisans-par-region:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
