const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // si souci Node v22, switch vers bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// LOGIN déjà existant
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe invalide' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res
    .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
    .json({ token, role: user.role });
});

// REGISTER nouveau
router.post('/register', async (req, res) => {
  try {
    const {
      firstName, lastName, username, email, phone,
      country, province, city, pickupPoint,
      isSeller, commerceName, neighborhood, idCardImage,
      password
    } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "Email ou nom d'utilisateur déjà utilisé" });
    }

    const hash = await bcrypt.hash(password, 10);

    let roles = ["buyer"];
    if (isSeller) roles.push("seller");

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      country,
      province,
      city,
      pickupPoint,
      isSeller,
      commerceName,
      neighborhood,
      idCardImage, // pour l’instant simple string (URL/base64)
      password: hash,
      role: roles
    });

    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
      .status(201)
      .json({ message: "Utilisateur créé avec succès", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
