const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth } = require("../middleware/authMiddleware");

// Rotas do proprio usuario autenticado.
router.get("/me", auth, (req, res) => res.json(req.user));
router.put("/me", auth, (req, res, next) => {
  req.params.id = req.user._id;
  next();
}, userController.updateUser);
router.delete("/affiliates/:affiliateId", auth, userController.removeAffiliate);

module.exports = router;
