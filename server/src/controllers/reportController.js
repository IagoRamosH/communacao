const Report = require("../models/Report");
const { createAuditLog } = require("../utils/audit");

// Cria uma denuncia vinculada ao usuario autenticado.
exports.createReport = async (req, res) => {
  try {
    const { event, type, title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Informe titulo e descricao da denuncia" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      event: event || null,
      type: type || "event",
      title,
      description,
    });

    await createAuditLog({
      action: "REPORT_CREATED",
      actor: req.user._id,
      targetModel: "Report",
      targetId: report._id,
      metadata: { type: report.type, event: report.event },
      req,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar denuncia", error: error.message });
  }
};

// Lista denuncias do usuario logado.
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate("event", "title startDate date location")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar denuncias", error: error.message });
  }
};

// Lista todas as denuncias para administradores.
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("event", "title startDate date location")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar denuncias", error: error.message });
  }
};
