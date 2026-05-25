const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const reportController = require("../controllers/reportController");
const { auth, isAdmin } = require("../middleware/authMiddleware");

// Rotas administrativas: usuarios, aprovacao de organizacao, voluntarios e auditoria.
router.use(auth, isAdmin);

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id/approve-organization", adminController.approveOrganization);
router.put("/users/:id/reject-organization", adminController.rejectOrganization);
router.get("/events/:eventId/volunteers", adminController.getVolunteersByEvent);
router.get("/audit-logs", adminController.getAuditLogs);
router.get("/reports", reportController.getReports);

module.exports = router;
