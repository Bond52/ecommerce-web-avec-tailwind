const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// utile derrière un proxy https pour cookies Secure
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://ecommerce-web-avec-tailwind.vercel.app",
  process.env.FRONTEND_URL, // (optionnel : préprod)
  "http://localhost:3000",
].filter(Boolean);

// CORS robuste (gère bien les préflights)
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/healthchecks
      const ok = allowedOrigins.includes(origin);
      console.log("CORS origin:", origin, "->", ok ? "allowed" : "blocked");
      cb(null, ok);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// OPTIONS explicites
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes); // -> POST /api/login

const sellerRoutes = require("./routes/seller.articles.routes");
app.use("/api/seller", sellerRoutes); // -> /api/seller/articles

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
