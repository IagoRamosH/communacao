const Event = require("../models/Event");

// Permite alterar evento para admin ou para o criador original.
async function canEditEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento nao encontrado" });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = event.creator.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: "Sem permissao para este evento" });
    }

    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({ message: "Erro ao validar permissao", error: error.message });
  }
}

module.exports = canEditEvent;
