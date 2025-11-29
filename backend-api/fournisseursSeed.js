/**
 * SEED FOURNISSEURS — VERSION MINUSCULE
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Fournisseur = require("./models/fournisseur"); // <-- en minuscule

const MONGO_URI = process.env.MONGO_URI;

// ----------------------------------------------------
//  📦 DONNÉES FOURNISSEURS
// ----------------------------------------------------

const fournisseurs = [
  {
    nom: "BoisPlus Cameroun",
    categorie: "Bois & Panneaux",
    produits: ["Hêtre", "Contreplaqué", "Medium (MDF)", "Pieds en bois massif"],
    telephone: "+237 699 55 44 33",
    email: "contact@boisplus.cm",
    adresse: "Bonabéri, Douala",
    siteweb: "https://boisplus.cm",
    logo: "/fournisseurs/boisplus.png",
    note: 4.7,
    delaiLivraison: "3–6 jours",
  },
  {
    nom: "Quincaillerie Express",
    categorie: "Quincaillerie & Métal",
    produits: [
      "Tiges métalliques",
      "Visserie M6 / M8",
      "Coulisses",
      "Barres en acier chromé",
    ],
    telephone: "+237 677 11 22 33",
    email: "info@quincaillerie-express.com",
    adresse: "Akwa, Douala",
    siteweb: "",
    logo: "/fournisseurs/quincaillerie-express.png",
    note: 4.4,
    delaiLivraison: "1–3 jours",
  },
  {
    nom: "MasterPaint",
    categorie: "Peintures & Vernis",
    produits: ["Vernis marin", "Peinture acrylique", "Base protectrice", "Durcisseur"],
    telephone: "+237 690 22 11 55",
    email: "service@masterpaint.cm",
    adresse: "Makepe, Douala",
    siteweb: "https://masterpaint.cm",
    logo: "/fournisseurs/masterpaint.png",
    note: 4.2,
    delaiLivraison: "4–7 jours",
  },
];

// ----------------------------------------------------
//  🚀 SEED PRINCIPAL
// ----------------------------------------------------

async function seed() {
  try {
    console.log("📡 Connexion à MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🗑 Suppression des FOURNISSEURS...");
    await Fournisseur.deleteMany({});

    console.log("📦 Ajout des fournisseurs...");
    await Fournisseur.insertMany(fournisseurs);

    console.log("🎉 SEED FOURNISSEURS TERMINÉ !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur SEED:", err);
    process.exit(1);
  }
}

seed();
