const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // ✅ adapte si le chemin est différent

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe invalide' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

  res.json({ token, role: user.role });
});

module.exports = router;
