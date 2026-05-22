const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// 🔹 Rotas
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes"); // 🔥 NOVO

dotenv.config();

// 🔹 Conectar ao banco
connectDB();

const app = express();

// 🔹 Middlewares
app.use(cors());

// 🔥 evita erro de JSON quebrado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Log simples (debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 🔹 Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes); // 🔥 NOVO

// 🔹 Rota base
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API ComunAção rodando 🚀",
  });
});

// 🔹 Health check (bom para deploy depois)
app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

// 🔹 Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada",
  });
});

// 🔹 Middleware de erro
app.use((err, req, res, next) => {
  console.error("Erro:", err);

  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor",
  });
});

module.exports = app;