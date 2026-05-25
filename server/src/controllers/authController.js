const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createAuditLog } = require("../utils/audit");

// Monta o payload publico do usuario para respostas da API.
function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organizationName: user.organizationName,
    organizationStatus: user.organizationStatus,
  };
}

// Gera um JWT com id e perfil do usuario autenticado.
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// Registra usuarios comuns automaticamente; admin pode ser criado via seed ou atualizado no banco.
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha nome, email e senha" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Usuario ja existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    await createAuditLog({
      action: "USER_REGISTERED",
      actor: user._id,
      targetModel: "User",
      targetId: user._id,
      req,
    });

    res.status(201).json({
      token: generateToken(user),
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuario", error: error.message });
  }
};

// Autentica usuario por email/senha e devolve token para uso no Axios.
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Informe email e senha" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciais invalidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Credenciais invalidas" });
    }

    await createAuditLog({
      action: "USER_LOGIN",
      actor: user._id,
      targetModel: "User",
      targetId: user._id,
      req,
    });

    res.json({
      token: generateToken(user),
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error: error.message });
  }
};

// Retorna os dados do usuario autenticado para manter sessao no frontend.
exports.me = async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};
