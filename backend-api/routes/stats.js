const express = require("express");
const router = express.Router();
const Artisan = require("../models/Artisan");

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

router.get("/artisans-par-region", async (req, res) => {
  try {
    const artisans = await Artisan.find({}, { ville: 1 });

    let counts = {};

    for (const art of artisans) {
      const region = REGIONS[art.ville] || null;
      if (!region) continue;

      counts[region] = (counts[region] || 0) + 1;
    }

    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
