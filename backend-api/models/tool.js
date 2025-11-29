const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  vendor: { type: String, default: null },
  price: { type: String, default: null },
  children: { type: [String], default: [] }
});

module.exports = mongoose.model("Tool", ToolSchema);
