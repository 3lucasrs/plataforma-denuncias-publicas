const { Complaint, Attachment, Response, User } = require("../models");

exports.create = async (req, res) => {
  try {
    const complaint = await Complaint.create({ ...req.body, userId: req.userId });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "last_name", "avatarUrl"],
        },
        Attachment,
        {
          model: Response,
          include: [
            {
              model: User,
              attributes: ["id", "name", "last_name", "avatarUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        {
          model: User, // Inclui o autor da PRÓPRIA DENÚNCIA
          attributes: ["id", "name", "last_name", "avatarUrl"],
        },
        Attachment,
        {
          model: Response,
          include: [
            {
              model: User,
              attributes: ["id", "name", "last_name", "avatarUrl"],
            },
          ],
        },
      ],
    });
    if (!complaint) return res.status(404).json({ message: "Denúncia não encontrada" });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResponsesByComplaintId = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaintExists = await Complaint.findByPk(complaintId);
    if (!complaintExists) {
      return res.status(404).json({ message: "Denúncia não encontrada." });
    }

    const responses = await Response.findAll({
      where: {
        complaintId: complaintId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "last_name", "avatarUrl"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(responses);
  } catch (error) {
    console.error("ERRO AO BUSCAR RESPOSTAS POR DENÚNCIA:", error);
    res.status(500).json({ message: "Erro interno ao buscar as respostas." });
  }
};

exports.update = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Denúncia não encontrada" });

    if (!req.isAdmin && req.userId !== complaint.userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    await complaint.update(req.body);
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Denúncia não encontrada" });

    if (!req.isAdmin && req.userId !== complaint.userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    await complaint.destroy();
    res.json({ message: "Denúncia removida com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findUserComplaints = async (req, res) => {
  try {
    const userIdFromToken = req.userId;

    const complaints = await Complaint.findAll({
      where: {
        userId: userIdFromToken,
      },

      include: [
        {
          model: User,
          attributes: ["id", "name", "last_name", "avatarUrl"],
        },
        Attachment,
        {
          model: Response,
          include: [
            {
              model: User,
              attributes: ["id", "name", "last_name", "avatarUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
