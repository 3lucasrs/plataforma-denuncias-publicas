const router = require("express").Router();
const { verifyToken } = require("../controllers/auth.controller");
const complaintController = require("../controllers/complaint.controller");

router.get("/my-complaints", complaintController.findUserComplaints);
router.post("/", complaintController.create);
router.get("/", complaintController.getAll); // Add isAdmin
router.get("/:id", complaintController.getById); // Cada um pode acessar a sua ????
router.get("/:id/responses", complaintController.getResponsesByComplaintId);
router.put("/:id", complaintController.update); // Add isAdmin
router.delete("/:id", complaintController.remove); // Add isAdmin

module.exports = router;
