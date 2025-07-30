const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ✅ CORS sécurisé : autorise seulement le frontend Vercel et localhost
const allowedOrigin = 'https://ecommerce-web-avec-tailwind.vercel.app';

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === allowedOrigin || origin === 'http://localhost:3000') {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ✅ Route d'authentification
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// ✅ Test simple
app.get("/", (req, res) => {
  res.send("🎉 API e-commerce opérationnelle !");
});

// ✅ Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
