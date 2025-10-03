const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { requireAuth, requireRole } = require("../middleware/auth");

// Toutes les routes ci-dessous nécessitent d’être authentifié comme acheteur
router.use(requireAuth, requireRole("acheteur"));

/**
 * GET /api/orders
 * -> retourne toutes les commandes de l’utilisateur connecté
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Erreur GET /api/orders :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/orders/en-cours
 * -> retourne uniquement les commandes en cours
 */
router.get("/en-cours", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id, status: "en_cours" })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Erreur GET /api/orders/en-cours :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * GET /api/orders/terminees
 * -> retourne uniquement les commandes terminées
 */
router.get("/terminees", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id, status: "terminee" })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Erreur GET /api/orders/terminees :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
