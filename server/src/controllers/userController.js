const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Event = require("../models/Event");
const Participation = require("../models/Participation");
const { createAuditLog } = require("../utils/audit");

// Remove senha de documentos de usuario antes de responder.
function publicFields(query) {
  return query.select("-password");
}

// Lista usuarios; apenas admin acessa pela rota protegida.
exports.getUsers = async (req, res) => {
  try {
    const users = await publicFields(User.find().sort({ createdAt: -1 }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuarios", error: error.message });
  }
};

// Cria usuario via painel administrativo, incluindo perfis especiais quando necessario.
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, organizationName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha nome, email e senha" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Usuario ja existe" });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || "user",
      organizationName: organizationName || null,
      organizationStatus: ["organization", "organizer"].includes(role) ? "approved" : "none",
      organizationApprovedAt: ["organization", "organizer"].includes(role) ? new Date() : null,
      organizationApprovedBy: ["organization", "organizer"].includes(role) ? req.user._id : null,
    });

    await createAuditLog({
      action: "USER_CREATED_BY_ADMIN",
      actor: req.user._id,
      targetModel: "User",
      targetId: user._id,
      metadata: { role: user.role },
      req,
    });

    const publicUser = user.toObject();
    delete publicUser.password;

    res.status(201).json(publicUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuario", error: error.message });
  }
};

// Busca usuario por id sem expor senha.
exports.getUserById = async (req, res) => {
  try {
    const user = await publicFields(User.findById(req.params.id).populate("affiliates.user", "name email"));

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuario", error: error.message });
  }
};

// Atualiza dados basicos do usuario; admin pode alterar perfil.
exports.updateUser = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ["name", "email", "organizationName"];
    const adminFields = ["role", "organizationStatus"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.user.role === "admin") {
      adminFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
    }

    const user = await publicFields(User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }));

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    await createAuditLog({
      action: "USER_UPDATED",
      actor: req.user._id,
      targetModel: "User",
      targetId: user._id,
      metadata: updates,
      req,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuario", error: error.message });
  }
};

// Exclui usuario e limpa participacoes vinculadas.
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    await Participation.deleteMany({ user: user._id });
    await Event.updateMany({}, { $pull: { participants: user._id } });
    await user.deleteOne();

    await createAuditLog({
      action: "USER_DELETED",
      actor: req.user._id,
      targetModel: "User",
      targetId: user._id,
      req,
    });

    res.json({ message: "Usuario removido" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover usuario", error: error.message });
  }
};

// Permite que organizacao remova um filiado da propria lista.
exports.removeAffiliate = async (req, res) => {
  try {
    if (!["organization", "organizer", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Apenas organizacoes podem remover filiados" });
    }

    const ownerId = req.user.role === "admin" && req.params.id ? req.params.id : req.user._id;
    const user = await publicFields(User.findByIdAndUpdate(
      ownerId,
      { $pull: { affiliates: { user: req.params.affiliateId } } },
      { new: true }
    ));

    if (!user) {
      return res.status(404).json({ message: "Organizacao nao encontrada" });
    }

    await createAuditLog({
      action: "AFFILIATE_REMOVED",
      actor: req.user._id,
      targetModel: "User",
      targetId: ownerId,
      metadata: { affiliateId: req.params.affiliateId },
      req,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover filiado", error: error.message });
  }
};
