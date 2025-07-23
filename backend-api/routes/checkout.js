// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// router.post("/", async (req, res) => {
//   try {
//     const { cart } = req.body;

//     const lineItems = cart.map(item => ({
//       price_data: {
//         currency: "eur",
//         product_data: {
//           name: item.title,
//         },
//         unit_amount: item.price * 100, // Stripe en centimes
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: lineItems,
//       success_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     });

//     res.json({ id: session.id });
//   } catch (err) {
//     console.error("Erreur paiement Stripe :", err);
//     res.status(500).json({ error: "Erreur lors de la création de la session de paiement" });
//   }
// });

// module.exports = router;
