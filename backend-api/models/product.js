const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,

    // 🔹 Artisan / vendeur (cohérent avec seller.articles.routes.js)
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Mets true si tu veux forcer la présence d'un vendeur
    },

    // 🔹 Commentaires + note
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 🔹 Likes (utilisateurs qui ont aimé le produit)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Ajoute createdAt / updatedAt automatiquement
  }
);

module.exports = mongoose.model("Product", ProductSchema);
