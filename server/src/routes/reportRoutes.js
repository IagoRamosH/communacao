const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { auth } = require("../middleware/authMiddleware");

// Rotas de denuncia usadas pelo frontend.
router.post("/", auth, reportController.createReport);
router.get("/my-reports", auth, reportController.getMyReports);

module.exports = router;
