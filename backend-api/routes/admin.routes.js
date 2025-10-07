const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");

/**
 * 🔐 Middleware de vérification admin
 * Gère les deux cas possibles :
 * - role: "admin"
 * - roles: ["admin", "vendeur"]
 */
function requireAdmin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    console.warn("❌ Tentative d'accès sans token admin");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Vérifie si l'utilisateur est admin
    const isAdmin =
      decoded.role === "admin" ||
      (Array.isArray(decoded.roles) && decoded.roles.includes("admin"));

    if (!isAdmin) {
      console.warn("🚫 Accès refusé - utilisateur non admin :", decoded);
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Erreur de vérification du token admin:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Appliquer le middleware à toutes les routes admin
router.use(requireAdmin);

/**
 * 🧍 Récupérer tous les utilisateurs
 */
router.get("/users", async (_, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Erreur /users :", err.message);
    res.status(500).json({ message: "Erreur lors du chargement des utilisateurs" });
  }
});

/**
 * 🧍 Supprimer un utilisateur
 */
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Erreur suppression utilisateur :", err.message);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
});

/**
 * 🗂 Récupérer les catégories
 */
router.get("/categories", async (req, res) => {
  try {
    const type = req.query.type || "produit";
    const cats = await Category.find({ type });
    res.json(cats);
  } catch (err) {
    console.error("Erreur /categories :", err.message);
    res.status(500).json({ message: "Erreur lors du chargement des catégories" });
  }
});

/**
 * 🗂 Créer une nouvelle catégorie
 */
router.post("/categories", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "name et type sont requis" });
    }
    const cat = await Category.create({ name, type });
    res.status(201).json(cat);
  } catch (err) {
    console.error("Erreur création catégorie :", err.message);
    res.status(500).json({ message: "Erreur lors de la création" });
  }
});

// 🗑 Supprimer une catégorie
router.delete("/categories/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Catégorie introuvable" });
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Erreur suppression catégorie :", err.message);
    res.status(500).json({ message: "Erreur suppression catégorie" });
  }
});


module.exports = router;
