const express = require("express");
const router = express.Router();
const Tool = require("../models/tool.js");

// GET all tools
router.get("/", async (req, res) => {
  res.json(await Tool.find());
});

// GET one tool by id
router.get("/:id", async (req, res) => {
  const tool = await Tool.findOne({ id: req.params.id });
  res.json(tool);
});

module.exports = router;
