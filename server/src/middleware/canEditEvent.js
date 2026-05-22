const Event = require("../models/Event");

async function canEditEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    // Admin pode tudo
    if (req.user.role === "admin") {
      return next();
    }

    // Criador pode editar/deletar
    if (event.creator.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ message: "Sem permissão" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = canEditEvent;