const mongoose = require("mongoose");

/* ===========================================================
   🧱 SOUS-SCHÉMAS
=========================================================== */

// 🔹 Historique des enchères (bids)
const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
});

const articleSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "auction"],
      default: "draft",
    },
    categories: [{ type: String }],
    sku: { type: String, unique: false, sparse: true },

    /* ===========================================================
       🏷️ PROMOTION
    ============================================================ */
    promotion: {
      isActive: { type: Boolean, default: false },
      discountPercent: { type: Number, default: 0 },
      newPrice: { type: Number, default: 0 },
      durationDays: { type: Number, default: 0 },
      durationHours: { type: Number, default: 0 },
      startDate: { type: Date },
      endDate: { type: Date },
    },

    /* ===========================================================
       💰 ENCHÈRES
    ============================================================ */
    auction: {
      isActive: { type: Boolean, default: false },
      endDate: { type: Date }, // date et heure de fin
      highestBid: { type: Number, default: 0 },
      highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      bids: [bidSchema], // historique des enchères
    },

    /* ===========================================================
       ❤️ LIKES ET COMMENTAIRES
    ============================================================ */
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        rating: { type: Number, default: 5, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

/* ===========================================================
   ⚙️ COMPORTEMENT AUTOMATIQUE
=========================================================== */

// Vérifie automatiquement si une enchère est terminée
articleSchema.pre("save", function (next) {
  if (
    this.auction &&
    this.auction.isActive &&
    this.auction.endDate &&
    new Date() > this.auction.endDate
  ) {
    this.auction.isActive = false;
    this.status = "draft";
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
