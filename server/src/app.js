const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("API rodando...");
});

module.exports = app;