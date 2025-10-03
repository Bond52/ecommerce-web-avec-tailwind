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
    status: { type: String, enum: ["en_cours", "terminee", "annulee"], default: "en_cours" },

    // ✅ Nouveau champ numéro de commande lisible
    orderNumber: { type: String, unique: true }
  },
  { timestamps: true }
);

// ✅ Génération auto d’un numéro de commande avant sauvegarde
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 chiffres aléatoires
    this.orderNumber = `CMD-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
