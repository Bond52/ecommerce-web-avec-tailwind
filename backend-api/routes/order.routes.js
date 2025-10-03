const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { requireAuth, requireRole } = require("../middleware/auth");

// Toutes les routes ci-dessous nécessitent d’être authentifié comme acheteur
router.use(requireAuth, requireRole("acheteur"));

/**
 * POST /api/orders
 * -> créer une nouvelle commande
 */
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide" });
    }

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
      status: "en_cours"
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Erreur POST /api/orders :", err);
    res.status(500).json({ message: "Erreur serveur", details: err.message });
  }
});

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
