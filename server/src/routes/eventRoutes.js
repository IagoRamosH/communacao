const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { auth } = require("../middleware/authMiddleware");
const canEditEvent = require("../middleware/canEditEvent");

// CRUD e acoes de participacao para eventos sociais.
router.get("/", eventController.getEvents);
router.get("/my-events", auth, eventController.getMyEvents);
router.get("/my-participations", auth, eventController.getMyParticipatingEvents);
router.get("/:id", eventController.getEventById);
router.post("/", auth, eventController.createEvent);
router.put("/:id", auth, canEditEvent, eventController.updateEvent);
router.delete("/:id", auth, canEditEvent, eventController.deleteEvent);
router.post("/:id/participate", auth, eventController.participateEvent);
router.get("/:id/volunteers", auth, canEditEvent, eventController.getEventVolunteers);

module.exports = router;
