// src/models/Article.js
import { Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }], // URLs d'images
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    categories: [{ type: String }],
    sku: { type: String, unique: false, sparse: true },
  },
  { timestamps: true }
);

export default model("Article", articleSchema);
