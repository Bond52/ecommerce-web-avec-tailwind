const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Article = require("../models/Article");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

/* ===========================================================
   🔐 MIDDLEWARES D'AUTHENTIFICATION ET DE ROLE
=========================================================== */

// Authentification
function requireAuth(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken = bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token) return res.status(401).json({ message: "Non autorisé. Aucun token fourni." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

// Vérification du rôle vendeur/admin
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Non autorisé." });
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : req.user.role
      ? [req.user.role]
      : [];
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole)
      return res.status(403).json({ message: "Accès refusé. Rôle insuffisant." });
    next();
  };
}

/* ===========================================================
   ☁️ CONFIGURATION CLOUDINARY
=========================================================== */

// ⚙️ Lecture intelligente des variables (Render ou .env)
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
  try {
    const parts = process.env.CLOUDINARY_URL.match(
      /cloudinary:\/\/(\d+):([^@]+)@([\w-]+)/
    );
    if (parts) {
      process.env.CLOUDINARY_API_KEY = parts[1];
      process.env.CLOUDINARY_API_SECRET = parts[2];
      process.env.CLOUDINARY_CLOUD_NAME = parts[3];
    }
  } catch (err) {
    console.error("❌ Erreur lors du parsing CLOUDINARY_URL :", err);
  }
}

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log de vérification (visible sur Render)
console.log("🌥️ Cloudinary config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅ OK" : "❌ MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ OK" : "❌ MISSING",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sawaka-produits",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ===========================================================
   ☁️ ROUTE UPLOAD CLOUDINARY
=========================================================== */
router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    console.log("🧾 Upload reçu :", req.files?.length, "fichiers");
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }
    const urls = req.files.map((f) => f.path);
    console.log("✅ Upload terminé :", urls);
    res.json({ urls });
  } catch (err) {
    console.error("❌ Erreur Cloudinary :", err);
    res.status(500).json({
      message: "Erreur upload Cloudinary",
      error: err.message,
    });
  }
});

/* ===========================================================
   📰 ROUTES PUBLIQUES / PROTÉGÉES
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

// Protection : uniquement vendeur/admin
router.use(requireAuth, requireRole("vendeur", "admin"));

/* ===========================================================
   🛠️ CRUD ARTICLES (Protégés)
=========================================================== */

// ➕ Créer un article
router.post("/articles", async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      owner: req.user.id,
    });
    await article.save();
    res.status(201).json(article);
  } catch (e) {
    console.error("Erreur création article:", e);
    res.status(500).json({ message: e.message });
  }
});

// 📜 Lister les articles du vendeur connecté
router.get("/articles", async (req, res) => {
  try {
    const query = { owner: req.user.id };
    if (req.query.status) query.status = req.query.status;
    if (req.query.q)
      query.title = { $regex: req.query.q, $options: "i" };

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Article.countDocuments(query);
    const items = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ✏️ Modifier un article
router.patch("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!article) return res.status(404).json({ message: "Article non trouvé." });
    res.json(article);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// 🗑 Supprimer un article
router.delete("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!article) return res.status(404).json({ message: "Article non trouvé." });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
