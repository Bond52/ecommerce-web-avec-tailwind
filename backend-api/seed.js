/**
 * SEED COMPLET — 5 ARTISANS + PRODUITS UNIQUES
 * --------------------------------------------
 * ✔ Supprime tous les articles
 * ✔ Supprime tous les utilisateurs sauf admin
 * ✔ Crée 5 vendeurs différents
 * ✔ Donne 5 produits uniques à chaque vendeur
 * ✔ 1 produit "draft" par vendeur
 * ✔ Prix, stocks, catégories, descriptions tous différents
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Article = require("./models/Article");

const MONGO_URI = process.env.MONGO_URI;

// ===========================================================
//  👤 Artisans
// ===========================================================
const artisans = [
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

// ===========================================================
//  🎁 PRODUITS UNIQUE PAR ARTISAN
// ===========================================================

const productsByVendor = {
  amina: [
    { title: "Sac en raphia brodé main", cat: "Mode & Accessoires" },
    { title: "Boucles d’oreilles en bronze", cat: "Bijoux" },
    { title: "Panier tressé multicolore", cat: "Art & Artisanat" },
    { title: "Tapis décoratif camerounais", cat: "Maison & Décoration" },
    { title: "Huile de karité bio non raffinée", cat: "Beauté & Bien-être", draft: true },
  ],

  samuel: [
    { title: "Tabouret africain sculpté", cat: "Art & Artisanat" },
    { title: "Lampe en bambou naturel", cat: "Maison & Décoration" },
    { title: "Chemise pagne premium", cat: "Mode & Accessoires" },
    { title: "Bracelet perles noires ébène", cat: "Bijoux" },
    { title: "Savon noir traditionnel", cat: "Beauté & Bien-être", draft: true },
  ],

  jean: [
    { title: "Chaise en bois iroko", cat: "Maison & Décoration" },
    { title: "Mortier de cuisine artisanal", cat: "Cuisine & Utilitaires" },
    { title: "Masque bamiléké précieux", cat: "Art & Artisanat" },
    { title: "Porte-clés cuir embossé", cat: "Mode & Accessoires" },
    { title: "Huile essentielle de clou de girofle", cat: "Beauté & Bien-être", draft: true },
  ],

  clara: [
    { title: "Coquillage décoratif monté", cat: "Maison & Décoration" },
    { title: "Collier perles marines", cat: "Bijoux" },
    { title: "Robe en tissu traditionnel", cat: "Mode & Accessoires" },
    { title: "Petit panier de plage", cat: "Art & Artisanat" },
    { title: "Beurre cacao artisanal", cat: "Beauté & Bien-être", draft: true },
  ],

  pascal: [
    { title: "Masque fang ancestral", cat: "Art & Artisanat" },
    { title: "Bol en bois exotique", cat: "Maison & Décoration" },
    { title: "Chapeau tissé camerounais", cat: "Mode & Accessoires" },
    { title: "Pendentif en pierre sculptée", cat: "Bijoux" },
    { title: "Lotion réparatrice naturelle", cat: "Beauté & Bien-être", draft: true },
  ],
};

// ===========================================================
//  🚀 SEED PRINCIPAL
// ===========================================================

async function seed() {
  try {
    console.log("📡 Connexion à MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🗑 Suppression des ARTICLES...");
    await Article.deleteMany({});

    console.log("🗑 Suppression des UTILISATEURS sauf admin...");
    await User.deleteMany({ roles: { $nin: ["admin"] } });

    // Hash mots de passe
    const hashedArtisans = await Promise.all(
      artisans.map(async (a) => ({
        ...a,
        password: await bcrypt.hash(a.password, 10),
      }))
    );

    console.log("👤 Création des artisans...");
    const createdUsers = await User.insertMany(hashedArtisans);

    console.log("📦 Génération des articles uniques...");
    let allArticles = [];

    for (const artisan of createdUsers) {
      const vendorId = artisan._id;
      const vendorKey = artisan.username;

      const productList = productsByVendor[vendorKey];

      const vendorArticles = productList.map((item, index) => ({
        vendorId,
        title: item.title,
        description: `Produit artisanal unique : ${item.title}. Fait main avec soin.`,
        price: 4000 + index * 3000,
        stock: 5 + index * 2,
        categories: [item.cat],
        status: item.draft ? "draft" : "published",
        images: [],
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

      allArticles.push(...vendorArticles);
    }

    await Article.insertMany(allArticles);

    console.log("🎉 SEED TERMINÉ — 5 vendeurs × 5 produits uniques !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur SEED:", err);
    process.exit(1);
  }
}

seed();
