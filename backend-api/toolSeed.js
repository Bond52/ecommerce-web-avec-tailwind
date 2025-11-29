require("dotenv").config();
const mongoose = require("mongoose");
const Tool = require("./models/tool");

// -------------------------
// 🌳 ARBRE D’OUTILS COMPLET
// -------------------------
const tools = [
  // =========================================================
  // NIVEAU 1 — OUTILS DE BASE (visible dans ton interface)
  // =========================================================

  {
    id: "scie",
    name: "Scie manuelle",
    vendor: "Bois & Bambou",
    price: "4 500 FCFA",
    children: ["main"]
  },

  {
    id: "metre",
    name: "Mètre ruban",
    vendor: "DécoBois",
    price: "1 000 FCFA",
    children: ["main"]
  },

  {
    id: "tournevis",
    name: "Tournevis",
    vendor: "Quincaillerie Express",
    price: "800 FCFA",
    children: [
      "tige-acier-tournevis",
      "poignee-tournevis",
      "assemblage-tournevis"
    ]
  },

  {
    id: "pinceau",
    name: "Pinceau",
    vendor: "MasterPaint",
    price: "500 FCFA",
    children: ["main"]
  },

  // =========================================================
  // NIVEAU 2 — COMPOSANTS POUR FABRICATION
  // =========================================================

  {
    id: "tige-acier-tournevis",
    name: "Tige en acier forgée",
    vendor: null,
    price: null,
    children: [
      "forge",
      "chalumeau",
      "enclume",
      "marteau-forge",
      "pince-forge",
      "bac-trempe",
      "lime",
      "meuleuse",
      "main"
    ]
  },

  {
    id: "poignee-tournevis",
    name: "Poignée en bois / plastique",
    vendor: null,
    price: null,
    children: [
      "tour-bois",
      "papier-abrasif",
      "perceuse",
      "colle-epoxy",
      "main"
    ]
  },

  {
    id: "assemblage-tournevis",
    name: "Assemblage tournevis (tige + poignée)",
    vendor: null,
    price: null,
    children: [
      "etau",
      "marteau",
      "colle-epoxy",
      "main"
    ]
  },

  // =========================================================
  // NIVEAU 3 — OUTILS ATOMIQUES
  // =========================================================

  { id: "forge", name: "Forge artisanale", vendor: null, price: null, children: ["main"] },
  { id: "chalumeau", name: "Chalumeau", vendor: "DécoBois", price: "20 000 FCFA", children: ["main"] },
  { id: "enclume", name: "Enclume", vendor: "Forgerons du Cameroun", price: "50 000 FCFA", children: ["main"] },
  { id: "marteau-forge", name: "Marteau de forge", vendor: "Quincaillerie Express", price: "3 000 FCFA", children: ["main"] },
  { id: "pince-forge", name: "Pince de forge", vendor: "Quincaillerie Express", price: "2 500 FCFA", children: ["main"] },
  { id: "bac-trempe", name: "Bac de trempe", vendor: null, price: null, children: ["main"] },
  { id: "lime", name: "Lime métallique", vendor: "MasterTool", price: "1 500 FCFA", children: ["main"] },
  { id: "meuleuse", name: "Meuleuse manuelle", vendor: "TechnoMarket", price: "8 000 FCFA", children: ["main"] },

  { id: "tour-bois", name: "Tour à bois (manuel)", vendor: "Menuiserie BoisPlus", price: "35 000 FCFA", children: ["main"] },
  { id: "papier-abrasif", name: "Papier abrasif", vendor: "DécoBois", price: "500 FCFA", children: ["main"] },
  { id: "perceuse", name: "Perceuse manuelle", vendor: "Quincaillerie Express", price: "12 000 FCFA", children: ["main"] },
  { id: "colle-epoxy", name: "Colle époxy", vendor: "MasterPaint", price: "1 200 FCFA", children: ["main"] },

  { id: "etau", name: "Étau", vendor: "TechnoMarket", price: "10 000 FCFA", children: ["main"] },
  { id: "marteau", name: "Marteau", vendor: "Quincaillerie Express", price: "1 800 FCFA", children: ["main"] },

  // FIN DE LA CHAÎNE
  {
    id: "main",
    name: "La main de l’artisan 🖐️",
    vendor: null,
    price: null,
    children: []
  }
];

// =========================================================
// 🌱 SEED DATABASE
// =========================================================
async function seed() {
  try {
    console.log("Connexion à MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🗑️ Suppression ancienne collection…");
    await Tool.deleteMany({});

    console.log("🌱 Insertion des outils…");
    await Tool.insertMany(tools);

    console.log("✅ Tools seed réussi !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur seed :", error);
    process.exit(1);
  }
}

seed();
