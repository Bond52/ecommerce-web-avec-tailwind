import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  pickupPoint: { type: String }, // pour les acheteurs

  // Partie vendeur
  isSeller: { type: Boolean, default: false },
  commerceName: { type: String },
  neighborhood: { type: String },
  idCardImage: { type: String }, // on stocke l’URL du fichier

  // Auth
  passwordHash: { type: String, required: true },
  roles: [{ type: String, enum: ["buyer", "seller"], default: "buyer" }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
