const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

/** CORS simple et sûr */
const cors = require("cors"); // <-- ajoute cet import en haut

const allowedOrigins = [
  "https://ecommerce-web-avec-tailwind.vercel.app",
  process.env.FRONTEND_URL, // optionnel : pour un domaine de prévisualisation
  "http://localhost:3000",
].filter(Boolean);

// CORS robuste (gère bien les préflights via proxy)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                  // autorise curl/healthchecks
    return cb(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// OPTIONS explicites (préflights)
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser()); // si tu poses un cookie "token" côté /login

// Routes existantes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// ✅ Routes vendeur CRUD
const sellerRoutes = require("./routes/seller.articles.routes");
app.use("/api/seller", sellerRoutes);

// Ping
app.get("/", (_, res) => res.send("🎉 API e-commerce opérationnelle !"));

// Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// Boot
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
