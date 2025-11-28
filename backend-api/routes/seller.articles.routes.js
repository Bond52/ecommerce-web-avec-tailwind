const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Article = require("../models/Article");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

/* ===========================================================
   🔐 AUTHENTIFICATION & ROLES
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
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : req.user.role
      ? [req.user.role]
      : [];

    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) return res.status(403).json({ message: "Accès refusé." });

    next();
  };
}

/* ===========================================================
   ☁️ CLOUDINARY CONFIG
=========================================================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api
  .ping()
  .then(() => console.log("✅ Cloudinary OK"))
  .catch((err) => console.error("❌ Cloudinary invalide :", err.message));

/* ===========================================================
   📤 UPLOAD CLOUDINARY VIA MULTER
=========================================================== */
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "Aucun fichier reçu" });

    const urls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sawaka-produits", resource_type: "image" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(file.buffer);
      });

      urls.push(result.secure_url);
    }

    res.json({ urls });
  } catch (err) {
    console.error("❌ Erreur upload Cloudinary :", err);
    res.status(500).json({ message: "Erreur upload Cloudinary", error: err.message });
  }
});

/* ===========================================================
   📰 ARTICLES PUBLICS
=========================================================== */
router.get("/public", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const search = req.query.q
      ? { title: { $regex: req.query.q, $options: "i" } }
      : {};

    const filter = { status: { $in: ["published", "auction"] }, ...search };

    const total = await Article.countDocuments(filter);
    const items = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   📄 DÉTAIL PUBLIC
=========================================================== */
router.get("/public/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("vendorId", "username commerceName city province")
      .populate("comments.user", "username firstName lastName");

    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    if (!["published", "auction"].includes(article.status)) {
      return res.status(403).json({ message: "Article non accessible publiquement." });
    }

    res.json(article);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   🔐 ROUTES PROTÉGÉES
=========================================================== */
router.use(requireAuth, requireRole("vendeur", "admin"));

/* ===========================================================
   ➕ CRÉATION D’UN ARTICLE
=========================================================== */
router.post("/articles", async (req, res) => {
  try {
    const body = req.body;

    /* 🔧 Normalisation des images */
    let images = [];

    if (typeof body.images === "string") {
      try {
        images = JSON.parse(body.images);
      } catch {
        images = [body.images];
      }
    } else if (Array.isArray(body.images)) {
      images = body.images;
    }

    body.images = images;

    /* 🔧 PROMOTION */
    if (body.promotion?.isActive) {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + (body.promotion.durationDays || 0));
      end.setHours(end.getHours() + (body.promotion.durationHours || 0));
      body.promotion.startDate = now;
      body.promotion.endDate = end;
    }

    const article = new Article({
      ...body,
      vendorId: req.user.id,
      status: body.status || "draft",
    });

    await article.save();
    res.status(201).json(article);
  } catch (e) {
    console.error("❌ Erreur création article :", e);
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   ✏️ MODIFIER ARTICLE (avec gestion images fixée)
=========================================================== */
router.patch("/articles/:id", async (req, res) => {
  try {
    const body = req.body;

    /* 🔧 Normalisation intelligente des images */
    let images;

    if (typeof body.images === "string") {
      try {
        images = JSON.parse(body.images);
      } catch {
        images = [body.images];
      }
    } else if (Array.isArray(body.images)) {
      images = body.images;
    } else {
      images = undefined; // Ne pas toucher si rien n'est envoyé
    }

    if (images !== undefined) {
      body.images = images;
    } else {
      delete body.images; // éviter d'écraser avec []
    }

    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      { $set: body },
      { new: true }
    );

    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    res.json(article);
  } catch (e) {
    console.error("❌ Erreur modification article :", e);
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   🗑 SUPPRESSION
=========================================================== */
router.delete("/articles/:id", async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user.id,
    });

    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   ❤️ LIKE
=========================================================== */
router.post("/articles/:id/like", requireAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    const userId = req.user.id;
    const liked = article.likes.includes(userId);

    if (liked) article.likes.pull(userId);
    else article.likes.push(userId);

    await article.save();
    res.json({ liked: !liked, totalLikes: article.likes.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   💬 COMMENTAIRE
=========================================================== */
router.post("/articles/:id/comment", requireAuth, async (req, res) => {
  try {
    const { text, rating } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    article.comments.push({
      user: req.user.id,
      text,
      rating: rating || 5,
      createdAt: new Date(),
    });

    await article.save();
    res.status(201).json({ message: "Commentaire ajouté." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
