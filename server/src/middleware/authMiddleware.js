const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 Middleware de autenticação
async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não fornecido",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Busca usuário completo no banco
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado",
      });
    }

    // 🔥 Agora req.user tem tudo (role, status, etc)
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
}

// 🔐 Middleware para ADMIN
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acesso restrito a administradores",
    });
  }
  next();
}

// 🔐 Middleware para ORGANIZAÇÃO
function isOrganizer(req, res, next) {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Apenas organizações podem acessar",
    });
  }
  next();
}

module.exports = {
  auth,
  isAdmin,
  isOrganizer,
};