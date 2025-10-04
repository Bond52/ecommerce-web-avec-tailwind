// backend-api/routes/budget.routes.js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

/**
 * POST /api/budget/assistant
 * -> Assistant Budget (sans IA)
 */
router.post("/assistant", async (req, res) => {
  try {
    const { montant, contexte } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    // ✅ Récupérer les articles <= montant
    const articles = await Article.find({ price: { $lte: montant } })
      .sort({ price: 1 })
      .limit(50);

    if (articles.length === 0) {
      return res.json({
        message: `Aucun article disponible pour ${montant} FCFA`,
        produits: [],
      });
    }

    // ✅ Remplir le budget
    let total = 0;
    let panier = [];
    for (let a of articles) {
      if (total + a.price <= montant) {
        panier.push(a);
        total += a.price;
      }
    }

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

/**
 * POST /api/budget/assistant-projet
 * -> Assistant Projet IA (français)
 */
router.post("/assistant-projet", async (req, res) => {
  try {
    const { montant, description } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const articles = await Article.find({ price: { $lte: montant } })
      .sort({ price: 1 })
      .limit(50);

    if (articles.length === 0) {
      return res.json({
        projet: "Aucun projet possible",
        message: `Aucun article disponible pour ${montant} FCFA`,
        produits: [],
      });
    }

    let prompt;
    if (description && description.trim().length > 0) {
      prompt = `Je dispose de ${montant} FCFA. Projet: ${description}. 
Liste les matériaux nécessaires et explique comment les utiliser pour le réaliser.`;
    } else {
      const nomsArticles = articles.map(a => a.title).join(", ");
      prompt = `Je dispose de ${montant} FCFA. Voici les articles disponibles: ${nomsArticles}. 
Propose un projet concret et réalisable uniquement avec ces articles.`;
    }

    // ✅ Appel HuggingFace francophone
    const HF_MODEL = "clementm85/t5-small-french-sum";
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const aiData = await response.json();
    if (aiData.error) {
      console.error("⚠️ Erreur HuggingFace:", aiData.error);
      return res.status(500).json({ error: "Erreur IA: " + aiData.error });
    }

    const texteAI = aiData[0]?.generated_text || "Aucune idée générée.";

    // ✅ Extraction naïve
    const keywords = texteAI.toLowerCase().split(/[\s,;.]+/).filter(w => w.length > 3);
    let composants = [];

    for (let kw of keywords) {
      const dispo = await Article.findOne({ title: new RegExp(kw, "i") });
      composants.push({
        composant: kw,
        disponible: !!dispo,
        vendeur: dispo ? dispo.sellerId : null,
      });
    }

    res.json({
      budget: montant,
      projet: description || "Projet suggéré automatiquement par l’IA",
      recommandations: texteAI,
      produits: articles,
      composants,
      source: "💡 Idée générée par l’intelligence Sawaka (modèle francophone)",
    });

  } catch (err) {
    console.error("❌ Erreur assistant projet:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
