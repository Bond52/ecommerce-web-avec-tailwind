const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Article = require("../models/Article");

/* ===========================================================
   🔐 MIDDLEWARES D'AUTHENTIFICATION ET DE ROLE
=========================================================== */

// Authentification : via header Authorization OU cookie "token"
function requireAuth(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken = bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token) return res.status(401).json({ message: "Non autorisé. Aucun token fourni." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, roles: [...] }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

// Vérification du rôle vendeur ou admin
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non autorisé. Utilisateur non connecté." });
    }

    // ✅ Vérifie "roles" (tableau) ou "role" (ancien format)
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : req.user.role
      ? [req.user.role]
      : [];

    const hasRole = roles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      return res.status(403).json({
        message: "Accès refusé. Vous devez être un vendeur ou un administrateur pour effectuer cette action.",
      });
    }

    next();
  };
}

/* ===========================================================
   📰 ROUTES PUBLIQUES
=========================================================== */

// Liste publique des articles publiés
router.get("/public", async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   🧭 ROUTES PROTÉGÉES (vendeur / admin)
=========================================================== */

router.use(requireAuth, requireRole("vendeur", "admin"));

/** ➕ CREATE */
router.post("/articles", async (req, res) => {
  try {
    const { title, description, price, stock, images, status, categories, sku } = req.body;
    if (!title || price == null)
      return res.status(400).json({ message: "Le titre et le prix sont requis." });

    const doc = await Article.create({
      vendorId: req.user.id,
      title,
      description: description || "",
      price: Number(price),
      stock: Number(stock) || 0,
      images: Array.isArray(images)
        ? images
        : images
        ? String(images)
            .split(",")
            .map((s) => s.trim())
        : [],
      status: status || "draft",
      categories: Array.isArray(categories)
        ? categories
        : categories
        ? String(categories)
            .split(",")
            .map((s) => s.trim())
        : [],
      sku: sku || undefined,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error("Erreur POST /articles :", e);
    res.status(400).json({ message: e.message });
  }
});

/** 📄 READ list (articles du vendeur connecté) */
router.get("/articles", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const q = (req.query.q || "").trim();
    const status = (req.query.status || "").trim();

    const filter = { vendorId: req.user.id };
    if (q) filter.title = { $regex: q, $options: "i" };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Article.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Article.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error("Erreur GET /articles :", e);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des articles." });
  }
});

/** 🔍 READ one */
router.get("/articles/:id", async (req, res) => {
  try {
    const doc = await Article.findOne({ _id: req.params.id, vendorId: req.user.id });
    if (!doc) return res.status(404).json({ message: "Article introuvable." });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/** ✏️ UPDATE */
router.patch("/articles/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price != null) updates.price = Number(updates.price);
    if (updates.stock != null) updates.stock = Number(updates.stock);

    const doc = await Article.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: "Article non trouvé." });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

/** ❌ DELETE */
router.delete("/articles/:id", async (req, res) => {
  try {
    const doc = await Article.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user.id,
    });
    if (!doc) return res.status(404).json({ message: "Article non trouvé." });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
