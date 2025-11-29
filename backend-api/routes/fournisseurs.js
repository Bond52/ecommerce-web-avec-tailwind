const express = require("express");
const Fournisseur = require("../models/fournisseur");

const router = express.Router();

// GET tous les fournisseurs
router.get("/", async (req, res) => {
  try {
    const data = await Fournisseur.find().sort({ nom: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST ajouter un fournisseur
router.post("/", async (req, res) => {
  try {
    const fournisseur = new Fournisseur(req.body);
    await fournisseur.save();
    res.status(201).json(fournisseur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
