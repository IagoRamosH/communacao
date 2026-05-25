const { isAdmin } = require("./authMiddleware");

// Alias mantido para rotas antigas que importam isAdmin diretamente.
module.exports = isAdmin;
