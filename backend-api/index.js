const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// 🔐 Obligatoire pour Render/Vercel (proxy HTTPS)
app.set("trust proxy", 1);

// 🌍 Origines autorisées
const allowedOrigins = [
  "https://ecommerce-web-avec-tailwind.vercel.app",
  "https://sawaka.org",
  "https://www.sawaka.org",
  process.env.FRONTEND_URL,
  "http://localhost:3000",
].filter(Boolean);

// 🌐 Ajoute Access-Control-Allow-Credentials AVANT CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// 🛡️ CORS dynamique (INDISPENSABLE pour Render)
app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise aussi Postman, mobile, requêtes internes
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Origine non autorisée par CORS : " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📨 Préflight OPTIONS automatique
app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  credentials: true
}));

// 📦 Parsers
app.use(express.json());
app.use(cookieParser());

// =======================
// ROUTES PRINCIPALES
// =======================

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const sellerRoutes = require("./routes/seller.articles.routes");
app.use("/api/seller", sellerRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/api/orders", orderRoutes);

const budgetRoutes = require("./routes/budget.routes");
app.use("/api/budget", budgetRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

const artisansRoute = require("./routes/artisans");
app.use("/api/artisans", artisansRoute);

const auctionRoutes = require("./routes/auction");
app.use("/api/auction", auctionRoutes);

app.use("/api/feedback", require("./routes/feedback"));

const statsRoutes = require("./routes/stats");
app.use("/stats", statsRoutes);

const fournisseursRoute = require("./routes/fournisseurs.js");
app.use("/api/fournisseurs", fournisseursRoute);


// CRON (fermeture enchères)
const cron = require("node-cron");
const closeExpiredAuctions = require("./cronJobs/endAuction");
cron.schedule("*/5 * * * *", closeExpiredAuctions);

// 🔎 Route simple
app.get("/", (_, res) => res.send("🎉 API e-commerce Sawaka opérationnelle !"));

// =======================
// 🔌 MongoDB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err.message);
    console.error("\n⚠️ Vérifiez votre MONGO_URI dans le .env\n");
  });

// 🚀 Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
);
