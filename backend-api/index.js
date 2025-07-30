const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// ✅ Configuration CORS robuste
const allowedOrigins = [
  'https://ecommerce-web-avec-tailwind.vercel.app',
  'https://sawaka.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

app.options('*', cors()); // ✅ autorise les requêtes préflight (OPTIONS)
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
