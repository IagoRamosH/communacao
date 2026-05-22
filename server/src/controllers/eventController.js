const Event = require("../models/Event");

// 🔹 CRIAR EVENTO
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,

      // 🔥 CORREÇÃO AQUI
      date: req.body.startDate || req.body.date,

      creator: req.user.id,
    });

    res.status(201).json(event);

  } catch (error) {
    console.error("ERRO AO CRIAR EVENTO:", error);

    res.status(500).json({
      message: "Erro ao criar evento",
      error: error.message,
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

// 🔹 LISTAR TODOS
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
      .populate("creator", "name email");

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

// 🔹 DELETAR EVENTO
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado",
      });
    }

    // 🔥 ADMIN OU DONO
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
      message: "Evento removido com sucesso",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao remover evento",
    });
  }
};