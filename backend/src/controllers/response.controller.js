const { Response, Complaint, User } = require("../models");

exports.create = async (req, res) => {
  try {
    const { complaintId, message } = req.body;
    const userId = req.userId;

    const complaintExists = await Complaint.findByPk(complaintId);
    if (!complaintExists) {
      return res.status(404).json({ message: "Denúncia não encontrada." });
    }

    const newResponse = await Response.create({
      message,
      complaintId,
      userId,
    });

    const responseWithUser = await Response.findByPk(newResponse.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "last_name", "avatarUrl"],
        },
      ],
    });

    res.status(201).json(responseWithUser);
  } catch (error) {
    console.error("ERRO AO CRIAR RESPOSTA:", error);
    res.status(500).json({ message: "Erro interno ao criar a resposta." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const responses = await Response.findAll({
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
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const response = await Response.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "last_name"],
        },
      ],
    });

    if (!response) {
      return res.status(404).json({ message: "Resposta não encontrada" });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { message } = req.body;
    const responseId = req.params.id;

    const responseToUpdate = await Response.findByPk(responseId);

    if (!responseToUpdate) {
      return res.status(404).json({ message: "Resposta não encontrada." });
    }

    if (responseToUpdate.userId !== req.userId) {
      return res.status(403).json({
        message: "Acesso negado. Você só pode editar seus próprios comentários.",
      });
    }

    responseToUpdate.message = message;
    await responseToUpdate.save();

    const updatedResponseWithUser = await Response.findByPk(responseId, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "last_name"],
        },
      ],
    });

    res.json(updatedResponseWithUser);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR RESPOSTA:", error);
    res.status(500).json({ message: "Erro interno ao atualizar a resposta." });
  }
};

exports.remove = async (req, res) => {
  try {
    const responseToDelete = await Response.findByPk(req.params.id);

    if (!responseToDelete) {
      return res.status(404).json({ message: "Resposta não encontrada." });
    }

    if (responseToDelete.userId !== req.userId && !req.admin) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    await responseToDelete.destroy();
    res.status(200).json({ message: "Resposta excluída com sucesso." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
