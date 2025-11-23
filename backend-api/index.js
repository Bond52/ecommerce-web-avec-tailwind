const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ✅ Nécessaire derrière un proxy HTTPS (Render, Vercel...) pour cookies Secure
app.set("trust proxy", 1);

// 🌍 Origines autorisées
const allowedOrigins = [
  "https://ecommerce-web-avec-tailwind.vercel.app",
  "https://sawaka.org",
  "https://www.sawaka.org",
  process.env.FRONTEND_URL,
  "http://localhost:3000",
].filter(Boolean);


// 🧩 Middleware CORS (version stable et compatible Render/Vercel)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ permet d'envoyer les cookies JWT entre domaines
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Réponse automatique aux requêtes OPTIONS (préflight)
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 📦 Parsers
app.use(express.json());
app.use(cookieParser());

// 🧭 Routes principales
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes); // -> POST /api/login, /api/register

const sellerRoutes = require("./routes/seller.articles.routes");
app.use("/api/seller", sellerRoutes); // -> /api/seller/articles

const orderRoutes = require("./routes/order.routes");
app.use("/api/orders", orderRoutes);

const budgetRoutes = require("./routes/budget.routes");
app.use("/api/budget", budgetRoutes);

// 👑 Routes Admin
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// 👤 Routes Utilisateur
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

// Routes produits
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

const artisansRoute = require("./routes/artisans");
app.use("/api/artisans", artisansRoute);

const auctionRoutes = require("./routes/auction");
app.use("/api/auction", auctionRoutes);

app.use("/api/feedback", require("./routes/feedback"));

const cron = require("node-cron");
const closeExpiredAuctions = require("./cronJobs/endAuction");

const statsRoutes = require("./routes/stats");
app.use("/stats", statsRoutes);


// Vérifie toutes les 5 minutes
cron.schedule("*/5 * * * *", closeExpiredAuctions);

// 🔎 Route de test rapide
app.get("/", (_, res) => res.send("🎉 API e-commerce Sawaka opérationnelle !"));

// 🔗 Connexion MongoDB (sans options deprecated)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
    console.error("\n⚠️  SOLUTIONS POSSIBLES:");
    console.error("1. MongoDB local: Installez et démarrez MongoDB avec 'mongod'");
    console.error("2. MongoDB Atlas (gratuit): Créez un compte sur https://cloud.mongodb.com");
    console.error("3. Vérifiez votre MONGO_URI dans le fichier .env\n");
  });

// 🚀 Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
);
