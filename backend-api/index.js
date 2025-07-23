const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

const corsOptions = {
  origin: ['https://sawaka.vercel.app', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// ✅ Ajout de la route d'authentification
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes); // 👈 ta route POST sera /api/login

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Test simple
app.get("/", (req, res) => {
  res.send("🎉 API e-commerce opérationnelle !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
