// migrateUsers.js
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const User = require("./user"); // adapte le chemin selon ton projet

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Mettre à jour tous les utilisateurs qui ont encore "role" au lieu de "roles"
    const result = await mongoose.connection.db.collection("users").updateMany(
      { role: { $type: "string" } },
      [
        {
          $set: {
            roles: ["$role"], // transforme en tableau
          },
        },
        { $unset: "role" }, // supprime l'ancien champ
      ]
    );

    console.log(`✅ Migration terminée. ${result.modifiedCount} utilisateurs mis à jour.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors de la migration :", err);
    process.exit(1);
  }
}

migrate();
