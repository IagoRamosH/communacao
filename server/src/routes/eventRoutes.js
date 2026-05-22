const express = require("express");
const router = express.Router();

// 🔹 Controllers
const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  deleteEvent,
} = require("../controllers/eventController");

// 🔹 Middlewares
const { auth } = require("../middleware/authMiddleware");
const canEditEvent = require("../middleware/canEditEvent");

// 🔥 NOVO: middleware para permitir apenas organizadores/admin
const isOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Apenas organizações podem criar eventos",
    });
  }
  next();
};

// 🔹 CRIAR EVENTO (AGORA COM REGRA)
router.post("/", auth, isOrganizer, createEvent);

// 🔹 MEUS EVENTOS (ANTES DO :id ⚠️)
router.get("/my-events", auth, getMyEvents);

// 🔹 LISTAR TODOS EVENTOS
router.get("/", getEvents);

// 🔹 BUSCAR EVENTO POR ID
router.get("/:id", getEventById);

// 🔹 EDITAR EVENTO
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
    res.status(500).json({ message: "Erro ao atualizar evento" });
  }
});

// 🔹 DELETAR EVENTO
router.delete("/:id", auth, canEditEvent, deleteEvent);

module.exports = router;