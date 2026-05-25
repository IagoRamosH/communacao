const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Valida o JWT enviado em Authorization: Bearer <token> e carrega o usuario.
async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nao fornecido" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Usuario nao encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido" });
  }
}

// Autoriza a rota somente para os perfis informados.
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso nao autorizado" });
    }

    next();
  };
}

module.exports = {
  auth,
  authorize,
  isAdmin: authorize("admin"),
  isOrganization: authorize("organization", "organizer", "admin"),
};
