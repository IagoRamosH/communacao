const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();
connectDB();

const app = express();

// Middlewares globais para JSON e integracao com frontend via Axios.
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log simples para acompanhar requisicoes durante testes no Postman.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rotas principais da API.
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

// Rota base para validar que a API esta online.
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API ComunAcao rodando",
  });
});

// Health check simples para deploy e monitoramento.
app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

// Tratamento de rota inexistente.
app.use((req, res) => {
  res.status(404).json({ message: "Rota nao encontrada" });
});

// Tratamento centralizado de erro inesperado.
app.use((err, req, res, next) => {
  console.error("Erro:", err);
  res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor",
  });
});

module.exports = app;
