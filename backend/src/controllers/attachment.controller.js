const path = require("path");
const fs = require("fs");
const { Attachment } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const attachments = await Attachment.findAll();
    res.json(attachments);
  } catch (error) {
    res.json({ error: "nada" });
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ message: "Anexo não encontrado" });
    res.json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const complaintId = req.params.complaintId;

    const attachment = await Attachment.create({
      type: req.file.mimetype,
      url: req.file.filename, // só o nome!
      complaintId: complaintId,
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ message: "Anexo não encontrado" });

    await attachment.update(req.body);
    res.json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ message: "Anexo não encontrado" });

    const complaintFolder = path.resolve(
      __dirname,
      "..",
      process.env.UPLOAD_DIR || "fotos",
      String(attachment.complaintId)
    );
    const filePath = path.join(complaintFolder, attachment.url);

    console.log("Caminho real calculado:", filePath);

    // Apaga o arquivo se existir
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Arquivo apagado com sucesso.");
    } else {
      console.log("Arquivo não encontrado para apagar:", filePath);
    }
    await attachment.destroy();

    //  verifica se a pasta ficou vazia
    const filesRemaining = fs.readdirSync(complaintFolder);
    if (filesRemaining.length === 0) {
      fs.rmdirSync(complaintFolder); // remove a pasta
      console.log("🗑️ Pasta do complaint apagada pois estava vazia:", complaintFolder);
    }

    res.json({ message: "Anexo removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover anexo:", error);
    res.status(500).json({ message: error.message });
  }
};
