/**
 * SEED COMPLET — Réinitialisation et création d’artisans + articles
 * ✔ Mots de passe hashés
 * ✔ Suppression des utilisateurs sauf admin
 * ✔ Suppression des articles
 * ✔ Pas d’image par défaut
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Article = require("./models/Article");

const MONGO_URI = process.env.MONGO_URI;

// ===============================
//  ARTISANS : 5 vendeurs
// ===============================

const artisans = [
  {
    firstName: "Jean",
    lastName: "Kouemé",
    username: "jean",
    email: "jean@example.com",
    password: "jean123",
    isSeller: true,
    roles: ["vendeur"],
    commerceName: "Atelier Kouemé",
    city: "Douala",
    country: "Cameroun",
  },
  {
    firstName: "Amina",
    lastName: "Njoh",
    username: "amina",
    email: "amina@example.com",
    password: "amina123",
    isSeller: true,
    roles: ["vendeur"],
    commerceName: "Créations d’Amina",
    city: "Yaoundé",
    country: "Cameroun",
  },
  {
    firstName: "Samuel",
    lastName: "Bikoko",
    username: "samuel",
    email: "samuel@example.com",
    password: "samuel123",
    isSeller: true,
    roles: ["vendeur"],
    commerceName: "Bikoko Design",
    city: "Bafoussam",
    country: "Cameroun",
  },
  {
    firstName: "Clara",
    lastName: "Moyo",
    username: "clara",
    email: "clara@example.com",
    password: "clara123",
    isSeller: true,
    roles: ["vendeur"],
    commerceName: "Atelier Moyo",
    city: "Kribi",
    country: "Cameroun",
  },
  {
    firstName: "Pascal",
    lastName: "Ebong",
    username: "pascal",
    email: "pascal@example.com",
    password: "pascal123",
    isSeller: true,
    roles: ["vendeur"],
    commerceName: "Ebong Artisanat",
    city: "Ebolowa",
    country: "Cameroun",
  },
];

// ===============================
//  ARTICLES PAR CATÉGORIE
// ===============================

const categoryArticles = [
  { title: "Chaise en bois massif", cat: "Maison & Décoration" },
  { title: "Sac en raphia tressé", cat: "Mode & Accessoires" },
  { title: "Masque traditionnel sculpté", cat: "Art & Artisanat" },
  { title: "Bracelet perles multicolores", cat: "Bijoux" },
  { title: "Huile de coco artisanale", cat: "Beauté & Bien-être" },
];

// ===============================
//       SEED PRINCIPAL
// ===============================

async function seed() {
  try {
    console.log("📡 Connexion à MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🗑 Suppression des ARTICLES...");
    await Article.deleteMany({});

    console.log("🗑 Suppression des UTILISATEURS sauf admin...");
    await User.deleteMany({ roles: { $nin: ["admin"] } });

    // ==============================
    // HASH MOTS DE PASSE (important!)
    // ==============================
    const hashedArtisans = await Promise.all(
      artisans.map(async (a) => ({
        ...a,
        password: await bcrypt.hash(a.password, 10),
      }))
    );

    console.log("👤 Création des 5 artisans...");
    const createdUsers = await User.insertMany(hashedArtisans);

    console.log("📦 Génération des articles...");
    let allArticles = [];

    for (const artisan of createdUsers) {
      const vendorId = artisan._id;

      const articlesForVendor = categoryArticles.map((item, index) => ({
        vendorId,
        title: item.title,
        description: `Produit artisanal fait main : ${item.title}`,
        price: 5000 + index * 3000,
        stock: 5 + index * 2,
        images: [], // ❌ aucune image par défaut
        status: index === 4 ? "draft" : "published", // 4 publiés, 1 brouillon
        categories: [item.cat],
        sku: `SKU-${vendorId}-${index}`,
        promotion: {
          isActive: false,
          discountPercent: 0,
          newPrice: 0,
          durationDays: 0,
          durationHours: 0,
        },
        auction: {
          isActive: false,
          highestBid: 0,
          bids: [],
        },
      }));

      allArticles.push(...articlesForVendor);
    }

    await Article.insertMany(allArticles);

    console.log("🎉 SEED TERMINÉ AVEC SUCCÈS !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur SEED:", err);
    process.exit(1);
  }
}

seed();
