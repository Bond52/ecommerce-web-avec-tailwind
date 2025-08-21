const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// utile derrière un proxy https pour cookies Secure
app.set("trust proxy", 1);

// Origines autorisées
const allowedOrigins = [
  "https://ecommerce-web-avec-tailwind.vercel.app", // ton frontend en prod
  process.env.FRONTEND_URL, // optionnel : autre URL (préprod)
  "http://localhost:3000", // ton frontend en dev
].filter(Boolean);

// Middleware CORS
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // autoriser les tests type curl
      const ok = allowedOrigins.includes(origin);
      console.log("🌍 Requête CORS:", origin, "->", ok ? "✅ autorisé" : "❌ bloqué");
      cb(null, ok);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Réponse explicite aux requêtes OPTIONS (préflight)
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Parsers
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes); // -> POST /api/login

const sellerRoutes = require("./routes/seller.articles.routes");
app.use("/api/seller", sellerRoutes); // -> /api/seller/articles

// Test ping
app.get("/", (_, res) => res.send("🎉 API e-commerce opérationnelle !"));

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Boot
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
