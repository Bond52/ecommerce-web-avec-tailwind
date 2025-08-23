const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
        title: String,
        price: Number,
        quantity: Number,
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["en_cours", "terminee", "annulee"], default: "en_cours" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
