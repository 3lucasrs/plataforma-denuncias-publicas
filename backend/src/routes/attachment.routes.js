const router = require("express").Router();
const upload = require("../config/multer");
const attachmentController = require("../controllers/attachment.controller");
const validateComplaint = require("../middleware/validateComplaint");

router.get("/", attachmentController.getAll);
// router.get("/:id", attachmentController.getById);
router.post(
  "/:complaintId",
  validateComplaint,
  upload.single("file"),
  attachmentController.create
);
// router.put("/:id", attachmentController.update);
router.delete("/:id", attachmentController.remove);

module.exports = router;
