// backend-api/routes/budget.routes.js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article"); // ✅ corrige ici

/**
 * POST /api/budget/assistant
 * Body : { montant: number, contexte?: string }
 */
router.post("/assistant", async (req, res) => {
  try {
    const { montant, contexte } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    // ✅ Chercher tous les articles dont le prix <= montant
    const articles = await Article.find({ price: { $lte: montant } })
      .sort({ price: 1 }) // par prix croissant
      .limit(50);

    if (articles.length === 0) {
      return res.json({
        message: `Aucun article disponible pour ${montant} FCFA`,
        produits: [],
      });
    }

    // Exemple : stratégie simple -> remplir le budget petit à petit
    let total = 0;
    let panier = [];
    for (let a of articles) {
      if (total + a.price <= montant) {
        panier.push(a);
        total += a.price;
      }
    }

    // Génération d’un "projet" simplifié
    const projet = contexte
      ? `Avec ${montant} FCFA pour "${contexte}", nous vous suggérons :`
      : `Avec ${montant} FCFA, vous pouvez acheter :`;

    res.json({
      projet,
      budget: montant,
      totalUtilise: total,
      produits: panier,
      restant: montant - total,
    });
  } catch (err) {
    console.error("❌ Erreur assistant budget:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
