const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // si souci Node v22, switch vers bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe invalide' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Cookie HttpOnly + JSON
  res
    .cookie("token", token, { httpOnly: true, sameSite: "none", secure: true })
    .json({ token, role: user.role });
});

module.exports = router;
