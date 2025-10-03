const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken =
    bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;

  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, roles }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.some(r => roles.includes(r))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
