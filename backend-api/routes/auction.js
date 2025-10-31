const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const { requireAuth } = require("../middleware/auth");

// 💰 Enchérir sur un article
router.post("/:id/bid", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article introuvable" });

    if (article.status !== "auction" || !article.auction?.isActive)
      return res.status(400).json({ message: "Cet article n'est pas en vente aux enchères." });

    if (new Date(article.auction.endDate) < new Date())
      return res.status(400).json({ message: "L'enchère est terminée." });

    if (amount <= article.auction.highestBid)
      return res.status(400).json({ message: "L'offre doit être supérieure à l'enchère actuelle." });

    // ✅ Mise à jour de l’enchère
    article.auction.highestBid = amount;
    article.auction.highestBidder = req.user._id;
    await article.save();

    res.json({ highestBid: article.auction.highestBid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de l'enchère." });
  }
});

module.exports = router;
