const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ Ajout du module cors

dotenv.config();
const app = express();

app.use(express.json());

// Trigger redeploy to fix CORS

// ✅ Middleware CORS à ajouter ici
app.use(cors({
  origin: ['https://sawaka.vercel.app', 'http://localhost:3000'], // frontend prod + local
  credentials: true
}));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Routes de base
app.get("/", (req, res) => {
  res.send("🎉 API e-commerce opérationnelle !");
});

// 👉 Routes applicatives
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
