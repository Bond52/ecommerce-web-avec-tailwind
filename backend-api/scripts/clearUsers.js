const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config({ path: __dirname + "/../.env" });

async function clearUsers() {
  try {
    console.log("🔍 Connexion à MongoDB :", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    const result = await User.deleteMany({});
    console.log(`🗑️ Utilisateurs supprimés : ${result.deletedCount}`);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

clearUsers();
