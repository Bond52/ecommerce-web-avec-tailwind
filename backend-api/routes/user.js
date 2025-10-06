import express from "express";
import User from "../models/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Récupérer le profil utilisateur connecté
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Modifier les infos utilisateur
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
