const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Article = require("../models/Article");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;


/* ===========================================================
   AUTH
=========================================================== */
function requireAuth(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken =
    bearer && bearer.startsWith("Bearer ")
      ? bearer.split(" ")[1]
      : null;

  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token)
    return res.status(401).json({ message: "Non autorisé." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : req.user.role
      ? [req.user.role]
      : [];

    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) return res.status(403).json({ message: "Accès refusé." });

    next();
  };
}

/* ===========================================================
   CLOUDINARY
=========================================================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.array("images", 5), async (req, res) => {
   console.log("📸 UPLOAD → Fichiers reçus :", req.files?.length);

  try {
    if (!req.files?.length)
      return res.status(400).json({ message: "Aucun fichier reçu" });

    const urls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sawaka-produits" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(file.buffer);
      });
      urls.push(result.secure_url);
    }

    res.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* ===========================================================
   PUBLIC LIST
=========================================================== */
router.get("/public", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const search = req.query.q
      ? { title: { $regex: req.query.q, $options: "i" } }
      : {};

    const filter = {
      status: { $in: ["published", "auction"] },
      ...search,
    };

    const total = await Article.countDocuments(filter);
    const items = await Article.find(filter)
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

/* ===========================================================
   PUBLIC DETAIL
=========================================================== */
router.get("/public/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("vendorId", "username commerceName city province")
      .populate("comments.user", "username firstName lastName");

    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    if (!["published", "auction"].includes(article.status))
      return res.status(403).json({ message: "Non public." });

    res.json(article);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   PROTECTED ROUTES
=========================================================== */
router.use(requireAuth, requireRole("vendeur", "admin"));

/* ===========================================================
   CREATE ARTICLE
=========================================================== */
router.post("/articles", async (req, res) => {
    console.log("🟡 CREATE → BODY REÇU :", req.body);

  try {
    const body = req.body;

    // Normalisation images
    let images = [];

    if (typeof body.images === "string") {
      try {
        images = JSON.parse(body.images);
      } catch {
        images = body.images ? [body.images] : [];
      }
    } else if (Array.isArray(body.images)) {
      images = body.images;
    }

    body.images = images;

    // Promotion
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
    console.error("❌ CREATE ERROR:", e);
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   GET VENDOR ARTICLES
=========================================================== */
router.get("/articles", async (req, res) => {
  try {
    const query = { vendorId: req.user.id };

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
    console.error("❌ GET ARTICLES ERROR:", e);
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   UPDATE ARTICLE
=========================================================== */
router.patch("/articles/:id", async (req, res) => {
console.log("🟠 UPDATE → BODY REÇU :", req.body);

  try {
    const body = req.body;

    if (typeof body.images === "string") {
      try {
        body.images = JSON.parse(body.images);
      } catch {
        body.images = [body.images];
      }
    }

    const article = await Article.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.user.id },
      body,
      { new: true }
    );

    if (!article)
      return res.status(404).json({ message: "Article non trouvé." });

    res.json(article);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/* ===========================================================
   DELETE ARTICLE
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

module.exports = router;
