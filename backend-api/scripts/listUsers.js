const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config({ path: __dirname + "/../.env" });

async function listUsers() {
  try {
    console.log("🔍 Connexion à MongoDB :", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    const users = await User.find({}, "email role").sort({ role: 1, email: 1 });
    if (users.length === 0) {
      console.log("⚠️ Aucun utilisateur trouvé !");
    } else {
      console.log("📋 Utilisateurs existants :");
      users.forEach(u => {
        console.log(` - ${u.email} (${u.role})`);
      });
    }
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

listUsers();
