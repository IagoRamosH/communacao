const express = require("express");
const router = express.Router();

// 🔹 IMPORT CORRETO DO CONTROLLER
const eventController = require("../controllers/eventController");

// 🔹 IMPORT CORRETO DO MIDDLEWARE
const { auth } = require("../middleware/authMiddleware");
const canEditEvent = require("../middleware/canEditEvent");

// 🔥 Middleware: apenas organizer/admin criam eventos
const isOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Apenas organizações podem criar eventos",
    });
  }
  next();
};

// 🔹 CRIAR EVENTO
router.post("/", auth, isOrganizer, eventController.createEvent);

// 🔥 PARTICIPAR DO EVENTO
router.post("/:id/participate", auth, eventController.participateEvent);

// 🔹 MEUS EVENTOS
router.get("/my-events", auth, eventController.getMyEvents);

// 🔹 LISTAR
router.get("/", eventController.getEvents);

// 🔹 BUSCAR
router.get("/:id", eventController.getEventById);

// 🔹 EDITAR
router.put("/:id", auth, canEditEvent, async (req, res) => {
  try {
    const Event = require("../models/Event");

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar evento",
    });
  }
});

// 🔹 DELETAR
router.delete("/:id", auth, canEditEvent, eventController.deleteEvent);

module.exports = router;