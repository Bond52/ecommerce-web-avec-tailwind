const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["produit", "vente"], required: true },
});

module.exports = mongoose.model("Category", categorySchema);
