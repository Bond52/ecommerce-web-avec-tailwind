require("dotenv").config();
const mongoose = require("mongoose");

// 📌 Modèle Tool (CommonJS)
const Tool = require("./models/tool.js");

async function seedTools() {
  try {
    console.log("🔌 Connexion à MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🗑️ Suppression des outils existants...");
    await Tool.deleteMany({});

    console.log("🌳 Insertion de l’arbre d’outils...");

    await Tool.insertMany([
      {
        id: "babyfoot",
        name: "Babyfoot (projet complet)",
        vendor: null,
        price: null,
        children: ["planche-bois", "visserie", "peinture"],
        requiredTools: [],
        materials: []
      },

      {
        id: "planche-bois",
        name: "Découper une planche de bois",
        vendor: "Menuiserie BoisPlus",
        price: "5 000 FCFA",
        children: ["scie", "metre", "main"],
        requiredTools: ["scie", "metre"],
        materials: ["Planche de bois brute"]
      },

      {
        id: "visserie",
        name: "Visserie / Assemblage",
        vendor: "Quincaillerie Express",
        price: "2 000 FCFA",
        children: ["tournevis", "main"],
        requiredTools: ["tournevis"],
        materials: ["Vis", "Rondelles", "Écrous"]
      },

      {
        id: "peinture",
        name: "Peinture / Finition",
        vendor: "MasterPaint Douala",
        price: "3 000 FCFA",
        children: ["pinceau", "main"],
        requiredTools: ["pinceau"],
        materials: ["Peinture", "Diluant"]
      },

      // 🔧 OUTILS SIMPLES
      {
        id: "scie",
        name: "Scie manuelle",
        vendor: "Bois & Bambou",
        price: "4 500 FCFA",
        children: ["main"],
        requiredTools: ["main"],
        materials: ["Acier trempé", "Bois (manche)"]
      },

      {
        id: "metre",
        name: "Mètre ruban",
        vendor: "DécoBois",
        price: "1 000 FCFA",
        children: ["main"],
        requiredTools: ["main"],
        materials: ["Ruban métallique", "Boîtier"]
      },

      {
        id: "tournevis",
        name: "Tournevis",
        vendor: "Quincaillerie Express",
        price: "800 FCFA",
        children: ["main"],
        requiredTools: ["main"],
        materials: ["Acier trempé", "Bois ou plastique (poignée)"]
      },

      {
        id: "pinceau",
        name: "Pinceau",
        vendor: "MasterPaint",
        price: "500 FCFA",
        children: ["main"],
        requiredTools: ["main"],
        materials: ["Poils (syntétiques ou naturels)", "Bois (manche)"]
      },

      // 🖐️ FIN DE CHAÎNE
      {
        id: "main",
        name: "La main de l’artisan 🖐️",
        vendor: null,
        price: null,
        children: [],
        requiredTools: [],
        materials: [],
        isRoot: true
      }
    ]);

    console.log("✅ SEED TERMINÉ : outils insérés avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ ERREUR SEED :", err);
    process.exit(1);
  }
}

seedTools();
