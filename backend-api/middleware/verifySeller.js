const jwt = require("jsonwebtoken");

/**
 * Vérifie si l'utilisateur est connecté ET possède le rôle vendeur
 */
function verifySeller(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Non autorisé. Aucun token trouvé." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Vérifie si l'utilisateur a le rôle vendeur
    if (!decoded.roles || !decoded.roles.includes("vendeur")) {
      return res.status(403).json({
        message: "Accès refusé. Vous devez être un vendeur pour effectuer cette action.",
      });
    }

    next();
  } catch (err) {
    console.error("Erreur vérification vendeur :", err);
    res.status(403).json({ message: "Token invalide ou expiré." });
  }
}

module.exports = verifySeller;
