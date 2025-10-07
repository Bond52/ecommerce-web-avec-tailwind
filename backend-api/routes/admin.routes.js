const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");

function requireAdmin(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.use(requireAdmin);

// 🧍 Tous les utilisateurs
router.get("/users", async (_, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// 🧍 Supprimer un utilisateur
router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// 🗂 Catégories
router.get("/categories", async (req, res) => {
  const cats = await Category.find({ type: req.query.type || "produit" });
  res.json(cats);
});

router.post("/categories", async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
});

module.exports = router;
