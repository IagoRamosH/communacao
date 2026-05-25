const Event = require("../models/Event");

// 🔹 CRIAR EVENTO
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      creator: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar evento",
      error: error.message,
    });
  }
};

// 🔹 LISTAR EVENTOS
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("creator", "name email");

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar eventos",
    });
  }
};

// 🔹 BUSCAR POR ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("creator", "name email")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar evento",
    });
  }
};

// 🔹 MEUS EVENTOS
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      creator: req.user.id,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar eventos",
    });
  }
};

// 🔥 NOVO: PARTICIPAR DO EVENTO
exports.participateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado",
      });
    }

    // 🔒 evitar duplicação
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({
        message: "Você já está participando deste evento",
      });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.json({
      message: "Participação confirmada",
      participants: event.participants.length,
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao participar do evento",
    });
  }
};

// 🔹 DELETAR EVENTO
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado",
      });
    }

    if (
      event.creator.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Sem permissão",
      });
    }

    await event.deleteOne();

    res.json({
      message: "Evento removido",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover evento",
    });
  }
};