const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const users = [
  { email: 'admin@test.com', password: 'admin123', role: 'admin' },
  { email: 'vendeur@test.com', password: 'vendeur123', role: 'vendeur' },
  { email: 'acheteur@test.com', password: 'acheteur123', role: 'acheteur' }
];

async function addUsers() {
console.log("🔍 URI MongoDB :", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connecté à MongoDB');

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.create({ email: user.email, password: hashed, role: user.role });
      console.log(`✅ Ajouté : ${user.email} (${user.role})`);
    } else {
      console.log(`ℹ️ Déjà existant : ${user.email}`);
    }
  }

  mongoose.disconnect();
}

addUsers().catch(console.error);
