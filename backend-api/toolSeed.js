// backend-api/toolSeed.js
const mongoose = require("mongoose");
const Tool = require("./models/tool");   // ✅ Chemin corrigé
require("dotenv").config();

const tools = [
  /* ----------------------------------------- */
  /* 1️⃣ SCIE MANUELLE                         */
  /* ----------------------------------------- */
  {
    id: "scie",
    name: "Scie manuelle",
    vendor: "Bois & Bambou",
    price: "4 500 FCFA",
    children: ["lame-acier", "lime", "marteau", "forge"],
  },

  { id: "lame-acier", name: "Lame en acier trempé", vendor: null, price: null, children: ["forge"] },
  { id: "lime", name: "Lime métal", vendor: "Quincaillerie Express", price: "1 000 FCFA", children: [] },
  { id: "marteau", name: "Marteau", vendor: "Quincaillerie Express", price: "1 800 FCFA", children: [] },
  { id: "forge", name: "Forge artisanale", vendor: null, price: null, children: [] },

  /* ----------------------------------------- */
  /* 2️⃣ TOURNEVIS                             */
  /* ----------------------------------------- */
  {
    id: "tournevis",
    name: "Tournevis",
    vendor: "Quincaillerie Express",
    price: "800 FCFA",
    children: ["tige-acier", "poignee-bois", "forge"],
  },

  { id: "tige-acier", name: "Tige en acier forgée", vendor: null, price: null, children: ["forge"] },
  { id: "poignee-bois", name: "Poignée en bois", vendor: "Menuiserie BoisPlus", price: "1 200 FCFA", children: ["rabot", "papier-abrasif"] },

  { id: "rabot", name: "Rabot", vendor: "MenuiPro", price: "9 000 FCFA", children: [] },
  { id: "papier-abrasif", name: "Papier abrasif", vendor: "DécoBois", price: "500 FCFA", children: [] },

  /* ----------------------------------------- */
  /* 3️⃣ TIGE EN ACIER                         */
  /* ----------------------------------------- */
  {
    id: "tige-acier-seule",
    name: "Tige en acier forgée",
    vendor: null,
    price: null,
    children: ["forge", "marteau", "enclume"],
  },

  { id: "enclume", name: "Enclume", vendor: "Forgerons du Cameroun", price: "50 000 FCFA", children: [] },
];

async function seed() {
  try {
    console.log("➡ Connexion MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connecté");

    console.log("➡ Reset collection tools…");
    await Tool.deleteMany({});

    console.log("➡ Insertion des outils…");
    await Tool.insertMany(tools);

    console.log("🎉 TOOLS SEED OK !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur seed :", err);
    process.exit(1);
  }
}

seed();
