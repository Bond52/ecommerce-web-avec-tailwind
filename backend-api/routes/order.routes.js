const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

// ✅ Middleware Auth
function requireAuth(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization?.split(" ")[1]);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Middleware Rôle
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

// ➕ Créer une commande (utilisateur classique)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

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

// ➡️ Liste des commandes de l’utilisateur connecté
router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 📦 Liste de toutes les commandes (livreur/admin)
router.get("/all", requireAuth, requireRole("livreur", "admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 🔄 Mise à jour du statut d'une commande (livreur/admin)
router.patch("/:id/status", requireAuth, requireRole("livreur", "admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["en_cours", "terminee", "annulee"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
