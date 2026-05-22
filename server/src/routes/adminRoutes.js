const express = require("express");
const router = express.Router();

const User = require("../models/User");

// 🔐 Middleware
const { auth } = require("../middleware/authMiddleware");

// 🔥 Middleware simples de admin
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acesso restrito a administradores",
    });
  }
  next();
}

// 🔹 LISTAR TODOS OS USUÁRIOS
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar usuários",
    });
  }
});

// 🔹 PROMOVER PARA ORGANIZER
router.put("/users/:id/promote-organizer", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "organizer" },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao promover usuário",
    });
  }
});

// 🔹 PROMOVER PARA ADMIN
router.put("/users/:id/promote-admin", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao promover usuário",
    });
  }
});

module.exports = router;