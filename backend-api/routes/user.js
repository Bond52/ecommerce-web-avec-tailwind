const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

/* ======================================================
   CLOUDINARY CONFIG
====================================================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer (upload en mémoire)
const upload = multer({ storage: multer.memoryStorage() });

/* ======================================================
   MIDDLEWARE AUTH
====================================================== */
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Non autorisé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token invalide" });
  }
}

/* ======================================================
   UPLOAD AVATAR CLOUDINARY
   POST /api/user/upload-avatar
====================================================== */
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Aucun fichier reçu" });

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sawaka-avatars" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });

      res.json({ url: result.secure_url });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ======================================================
   GET USER PROFILE
====================================================== */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur serveur", details: err.message });
  }
});

/* ======================================================
   UPDATE USER PROFILE
====================================================== */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour",
      details: err.message,
    });
  }
});

module.exports = router;
