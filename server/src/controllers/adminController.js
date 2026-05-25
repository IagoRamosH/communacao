const User = require("../models/User");
const Event = require("../models/Event");
const Participation = require("../models/Participation");
const AuditLog = require("../models/AuditLog");
const { createAuditLog } = require("../utils/audit");

// Aprova a transformacao de usuario em organizacao apos ter 5 filiadas em eventos.
exports.approveOrganization = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    const userEvents = await Event.find({ creator: user._id }).select("_id");
    const eventIds = userEvents.map((event) => event._id);
    const affiliatesCount = await Participation.countDocuments({
      event: { $in: eventIds },
      status: "confirmed",
    });

    if (affiliatesCount < 5) {
      return res.status(400).json({
        message: "Usuario ainda nao possui 5 filiadas em seus eventos",
        affiliatesCount,
      });
    }

    user.role = "organization";
    user.organizationStatus = "approved";
    user.organizationName = req.body.organizationName || user.organizationName || user.name;
    user.organizationApprovedAt = new Date();
    user.organizationApprovedBy = req.user._id;
    await user.save();

    await createAuditLog({
      action: "ORGANIZATION_APPROVED",
      actor: req.user._id,
      targetModel: "User",
      targetId: user._id,
      metadata: { affiliatesCount },
      req,
    });

    const publicUser = user.toObject();
    delete publicUser.password;

    res.json(publicUser);
  } catch (error) {
    res.status(500).json({ message: "Erro ao aprovar organizacao", error: error.message });
  }
};

// Rejeita uma solicitacao/elegibilidade de organizacao.
exports.rejectOrganization = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { organizationStatus: "rejected" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    await createAuditLog({
      action: "ORGANIZATION_REJECTED",
      actor: req.user._id,
      targetModel: "User",
      targetId: user._id,
      req,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao rejeitar organizacao", error: error.message });
  }
};

// Lista voluntarios de qualquer evento para administradores.
exports.getVolunteersByEvent = async (req, res) => {
  try {
    const volunteers = await Participation.find({
      event: req.params.eventId,
      kind: "volunteer",
      status: "confirmed",
    }).populate("user", "name email role");

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar voluntarios", error: error.message });
  }
};

// Lista registros de auditoria para fiscalizacao administrativa.
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar auditoria", error: error.message });
  }
};
