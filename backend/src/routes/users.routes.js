const express = require("express");
const router = express.Router();
const users_controller = require("../controllers/users.controller");
const { isAdmin, ensureUserIsOwner } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/me/avatar", upload.single("avatar"), users_controller.uploadAvatar);
router.get("/me", users_controller.getProfile);
router.put("/me", users_controller.updateProfile);
router.get("/", isAdmin, users_controller.getAll);
router.get("/last-registered", isAdmin, users_controller.getLatestRegistered);
router.get("/:id", ensureUserIsOwner("id"), users_controller.getById);
router.put("/:id", isAdmin, users_controller.update);
router.delete("/:id", isAdmin, users_controller.delete);

module.exports = router;
