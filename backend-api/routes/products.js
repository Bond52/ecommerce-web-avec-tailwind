const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const jwt = require("jsonwebtoken");

/* ===========================================================
   🔐 MIDDLEWARE D’AUTHENTIFICATION
=========================================================== */
function requireAuth(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken =
    bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token)
    return res.status(401).json({ message: "Non autorisé. Aucun token fourni." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
}

/* ===========================================================
   🔹 GET : Liste des produits avec pagination
   Exemple : /api/products?page=1&limit=12
=========================================================== */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .populate("vendorId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================================================
   🔹 GET : Un seul produit par ID
=========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendorId", "name email phone")
      .populate("comments.user", "name");
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================================================
   🔹 POST : Ajouter un nouveau produit
=========================================================== */
router.post("/", requireAuth, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      vendorId: req.user.id,
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================================================
   🔹 POST : Ajouter un commentaire et une note
=========================================================== */
router.post("/:id/comment", requireAuth, async (req, res) => {
  const { text, rating } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    const comment = {
      user: req.user._id,
      text,
      rating,
      createdAt: new Date(),
    };

    product.comments.push(comment);
    await product.save();

    res.status(201).json({ message: "Commentaire ajouté", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================================================
   🔹 POST : Liker / unliker un produit
=========================================================== */
router.post("/:id/like", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    const alreadyLiked = product.likes.includes(req.user._id);
    if (alreadyLiked) {
      product.likes.pull(req.user._id);
    } else {
      product.likes.push(req.user._id);
    }

    await product.save();
    res.json({
      liked: !alreadyLiked,
      totalLikes: product.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
