const router = require("express").Router();
const { verifyToken } = require("../controllers/auth.controller");
const responseController = require("../controllers/response.controller");
const { isAdmin } = require("../middleware/auth.middleware");

router.post("/", responseController.create);
router.get("/", responseController.getAll);
router.get("/:id", responseController.getById);
router.put("/:id", responseController.update);
router.delete("/:id", responseController.remove);

module.exports = router;
