const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

/** CORS simple et sûr */
const allowedOrigins = [
  "https://ecommerce-web-avec-tailwind.vercel.app",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

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
