import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },
    province: { type: String, default: "" },
    city: { type: String, default: "" },
    pickupPoint: { type: String, default: "" }, // acheteur

    // Partie vendeur
    isSeller: { type: Boolean, default: false },
    commerceName: { type: String, default: "" },
    neighborhood: { type: String, default: "" },
    idCardImage: { type: String, default: "" }, // lien

    // Auth
    password: { type: String, required: true }, // hash bcrypt
    roles: [
      {
        type: String,
        enum: ["acheteur", "vendeur", "admin", "livreur"],
        default: "acheteur"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
