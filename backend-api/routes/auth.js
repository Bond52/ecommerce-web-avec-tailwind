const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // si souci Node v22, switch vers bcryptjs
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe invalide" });

    // ⚠️ utiliser _id et pas id
    const token = jwt.sign(
      { id: user._id.toString(), roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
      .json({
        token,
        roles: user.roles,
        username: user.username,  // ✅ Ajouté
        firstName: user.firstName,
        lastName: user.lastName
      });
  } catch (err) {
    console.error("❌ Erreur dans /login :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      firstName, lastName, username, email, phone,
      country, province, city, pickupPoint,
      isSeller, commerceName, neighborhood, idCardImage,
      password
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Nom d'utilisateur, email et mot de passe requis" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "Email ou nom d'utilisateur déjà utilisé" });
    }

    const hash = await bcrypt.hash(password, 10);

    let roles = ["acheteur"]; // tout le monde est acheteur
    if (isSeller) roles.push("vendeur");

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      country,
      province,
      city,
      pickupPoint,
      isSeller: Boolean(isSeller),
      commerceName,
      neighborhood,
      idCardImage,
      password: hash,
      roles
    });

    // ⚠️ utiliser _id
    const token = jwt.sign(
      { id: user._id.toString(), roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
      .status(201)
      .json({
        message: "Utilisateur créé avec succès",
        token,
        roles: user.roles,
        username: user.username, // ✅ Ajouté
        firstName: user.firstName,
        lastName: user.lastName
      });
  } catch (err) {
    console.error("❌ Erreur dans /register :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;
