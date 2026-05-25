const AuditLog = require("../models/AuditLog");

// Registra acoes importantes sem interromper a resposta principal se o log falhar.
async function createAuditLog({ action, actor, targetModel, targetId, metadata = {}, req }) {
  try {
    await AuditLog.create({
      action,
      actor: actor || null,
      targetModel,
      targetId,
      metadata,
      ip: req?.ip || null,
    });
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error.message);
  }
}

module.exports = { createAuditLog };
