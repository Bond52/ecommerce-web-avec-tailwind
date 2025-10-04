// backend-api/routes/budget.routes.js
const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// ⚠️ Node 18+ possède fetch en natif → pas besoin de "node-fetch"

/**
 * POST /api/budget/assistant-projet
 * -> Génération d'idée de projet avec IA + vérification dans Sawaka
 */
router.post("/assistant-projet", async (req, res) => {
  try {
    const { montant, description } = req.body;
    if (!montant || montant <= 0) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    // ✅ Récupérer les articles Sawaka en dessous du budget
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

    // ✅ Préparer le prompt IA (en français)
    let prompt;
    if (description && description.trim().length > 0) {
      prompt = `Je dispose de ${montant} FCFA. Projet: ${description}. 
Liste les matériaux nécessaires et explique comment les utiliser pour réaliser ce projet.`;
    } else {
      const nomsArticles = articles.map(a => a.title).join(", ");
      prompt = `Je dispose de ${montant} FCFA. Voici les articles disponibles: ${nomsArticles}. 
Propose un projet concret et créatif réalisable uniquement avec ces articles.`;
    }

    // ✅ Appel HuggingFace (modèle francophone)
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

    // 🔍 Gestion d’erreur HuggingFace
    if (aiData.error) {
      console.error("⚠️ Erreur HuggingFace:", aiData.error);
      return res.status(500).json({ error: "Erreur IA: " + aiData.error });
    }

    const texteAI = aiData[0]?.generated_text || "Aucune idée générée.";

    // ✅ Extraction simple des mots-clés pour vérifier disponibilité sur Sawaka
    const keywords = texteAI
      .toLowerCase()
      .split(/[\s,;.]+/)
      .filter(w => w.length > 3);

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
    });

  } catch (err) {
    console.error("❌ Erreur assistant projet:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
