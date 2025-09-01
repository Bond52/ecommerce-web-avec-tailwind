const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config({ path: __dirname + "/../.env" });

const users = [
  // 👑 Admin
  { email: "admin@test.com", password: "admin123", role: "admin" },

  // 🛒 Acheteurs
  { email: "acheteur1@test.com", password: "acheteur123", role: "acheteur" },
  { email: "acheteur2@test.com", password: "acheteur123", role: "acheteur" },

  // 🏪 Vendeurs
  { email: "vendeur1@test.com", password: "vendeur123", role: "vendeur" },
  { email: "vendeur2@test.com", password: "vendeur123", role: "vendeur" },
  { email: "vendeur3@test.com", password: "vendeur123", role: "vendeur" },

  // 🚚 Livreur
  { email: "livreur@test.com", password: "livreur123", role: "livreur" },
];

async function addUsers() {
  console.log("🔍 Connexion à MongoDB :", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connecté à MongoDB");

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.create({ email: user.email, password: hashed, role: user.role });
      console.log(`✅ Ajouté : ${user.email} (${user.role})`);
    } else {
      console.log(`ℹ️ Déjà existant : ${user.email}`);
    }
  }

  mongoose.disconnect();
}

addUsers().catch(console.error);
