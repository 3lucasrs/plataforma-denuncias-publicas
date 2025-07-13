const multer = require("multer");
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const complaintId = req.params.complaintId;

    if (!complaintId) {
      return cb(new Error("complaintId não informado na URL"));
    }

    const uploadPath = path.resolve(__dirname, "..", "..", UPLOAD_DIR, complaintId);

    //aqui vai criar a pasta se não existir....
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limite de 5mb
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]; // só imagem
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Arquivo inválido. Só é permitido imagens."));
    }
  },
});

module.exports = upload;
