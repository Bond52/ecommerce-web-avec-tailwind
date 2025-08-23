const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization?.split(" ")[1]);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ➕ Créer une commande
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Panier vide" });

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
      status: "en_cours",
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ➡️ Liste des commandes de l’utilisateur
router.get("/", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
