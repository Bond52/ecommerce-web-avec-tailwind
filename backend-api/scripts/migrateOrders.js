const mongoose = require("mongoose");
const Order = require("../models/Order");
const dotenv = require("dotenv");

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    const orders = await Order.find({ orderNumber: { $exists: false } });
    for (const order of orders) {
      order.orderNumber = `CMD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await order.save();
      console.log(`🔄 Ajouté orderNumber à ${order._id}`);
    }

    console.log("🎉 Migration terminée !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur migration :", err);
    process.exit(1);
  }
})();
