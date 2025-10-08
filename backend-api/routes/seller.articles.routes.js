const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Article = require("../models/Article");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

/* ===========================================================
   🔐 MIDDLEWARES D'AUTHENTIFICATION ET DE ROLE
=========================================================== */

// Authentification
function requireAuth(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken =
    bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token)
    return res
      .status(401)
      .json({ message: "Non autorisé. Aucun token fourni." });

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
      return res
        .status(403)
        .json({ message: "Accès refusé. Rôle insuffisant." });
    next();
  };
}

/* ===========================================================
   ☁️ CONFIGURATION CLOUDINARY (version stable Render)
=========================================================== */

// ⚠️ On ne parse plus CLOUDINARY_URL : on attend 3 variables directes
// CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("🌥️ Cloudinary config vérifiée :", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING",
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ OK" : "❌ MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ OK" : "❌ MISSING",
});

/* ===========================================================
   ☁️ UPLOAD CLOUDINARY (stream + mémoire)
=========================================================== */

// On stocke les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    console.log("🧾 Upload reçu :", req.files.length, "fichier(s)");

    const urls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "sawaka-produits",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Erreur Cloudinary (upload_stream) :", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });

      urls.push(result.secure_url);
    }

    console.log("✅ Upload Cloudinary terminé :", urls);
    res.json({ urls });
  } catch (err) {
    console.error("❌ Erreur upload Cloudinary :", err);
    res.status(500).json({
      message: "Erreur upload Cloudinary",
      error: err.message || err.toString(),
    });
  }
});

/* ===========================================================
   📰 ROUTES PUBLIQUES / PROTÉGÉES
=========================================================== */

// Liste publique des articles publiés
router.get("/public", async (req, res) => {
  try {
    const articles = await Article.find({ status: "published" }).sort({
      createdAt: -1,
    });
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
    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });
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
    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
