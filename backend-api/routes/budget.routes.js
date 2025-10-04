// backend-api/routes/budget.routes.js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
// fetch est dispo nativement dans Node.js 18+

/**
 * POST /api/budget/assistant
 * -> Suggestion d'articles sans IA
 */
router.post("/assistant", async (req, res) => {
  try {
    const { montant } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const articles = await Article.find({ price: { $lte: montant } })
      .sort({ price: 1 })
      .limit(50);

    if (articles.length === 0) {
      return res.json({
        message: `Aucun article disponible pour ${montant} FCFA`,
        produits: [],
      });
    }

    let total = 0;
    let panier = [];
    for (let a of articles) {
      if (total + a.price <= montant) {
        panier.push(a);
        total += a.price;
      }
    }

    res.json({
      projet: `Avec ${montant} FCFA, vous pouvez acheter :`,
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

/**
 * POST /api/budget/assistant-ia
 * -> Génération d’idées de projets avec IA + correspondance articles Sawaka
 */
router.post("/assistant-ia", async (req, res) => {
  try {
    const { montant } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    // Récupérer les articles disponibles sur Sawaka
    const articles = await Article.find().limit(50);

    // Construire un prompt IA basé sur les articles Sawaka
    const listeArticles = articles.map(a => a.title).join(", ");
    const prompt = `Avec un budget de ${montant} FCFA et les composants disponibles suivants : ${listeArticles}. 
Propose un ou plusieurs projets faisables (par ex: tissu + teinture = habits). 
Donne une explication courte et claire.`;

    // Appel HuggingFace (Flan-T5 ou autre modèle gratuit)
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_KEY}`, // clé HuggingFace
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const aiData = await response.json();
    const projetIA = aiData[0]?.generated_text || "Aucune idée générée.";

    res.json({
      projetIA,
      budget: montant,
      produits: articles,
    });

  } catch (err) {
    console.error("❌ Erreur assistant IA:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
