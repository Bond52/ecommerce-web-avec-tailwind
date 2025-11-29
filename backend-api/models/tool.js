const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },

  vendor: { type: String, default: null },
  price: { type: String, default: null },

  children: [{ type: String }],
  requiredTools: [{ type: String }],
  materials: [{ type: String }],

  isRoot: { type: Boolean, default: false }
});

module.exports = mongoose.model("Tool", toolSchema);
