const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      creator: req.userId,
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar evento",
    });
  }
};

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

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("creator", "name email");

    res.json(event);

  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar evento",
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Evento não encontrado",
      });
    }

    if (event.creator.toString() !== req.userId) {
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