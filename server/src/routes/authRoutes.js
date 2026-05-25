const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");

// Rotas de autenticacao usadas pelo frontend para criar sessao JWT.
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth, authController.me);

module.exports = router;
