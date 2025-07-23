// const express = require("express");
// const router = express.Router();
// const Product = require("../models/product");

// // GET : liste des produits
// router.get("/", async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });

// // GET : un seul produit
// router.get("/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: "Produit non trouvé" });
//   res.json(product);
// });

// // POST : ajouter un produit
// router.post("/", async (req, res) => {
//   const newProduct = new Product(req.body);
//   const saved = await newProduct.save();
//   res.status(201).json(saved);
// });

// module.exports = router;
