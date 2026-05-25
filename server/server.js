require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Inicializa o servidor HTTP da API.
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
