const controller = require("../controllers/analytics.controller");
const { verifyToken } = require("../controllers/auth.controller");
const { isAdmin } = require("../middleware/auth.middleware");
const router = require("express").Router();

router.get("/summary", controller.getSummary);

module.exports = router;
