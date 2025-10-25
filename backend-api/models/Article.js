const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    categories: [{ type: String }],
    sku: { type: String, unique: false, sparse: true },

    // 🆕 Ajouts pour likes et commentaires
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

module.exports = mongoose.model("Article", articleSchema);

