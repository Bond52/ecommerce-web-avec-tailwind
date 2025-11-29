const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({
  nom: String,
  categorie: String,
  produits: [String],
  telephone: String,
  email: String,
  adresse: String,
  siteweb: String,
  logo: String,
  note: Number,
  delaiLivraison: String,
});

// Nom interne du modèle → peut rester avec M majuscule
module.exports = mongoose.model("Fournisseur", fournisseurSchema);
