const express = require("express");
const router = express.Router();

let cart = []; // panier en mémoire

// GET : afficher le panier
router.get("/", (req, res) => {
  res.json(cart);
});

// POST : ajouter un produit au panier
router.post("/", (req, res) => {
  const { productId, quantity } = req.body;
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.status(201).json(cart);
});

// DELETE : vider le panier
router.delete("/", (req, res) => {
  cart = [];
  res.json({ message: "Panier vidé" });
});

module.exports = router;
