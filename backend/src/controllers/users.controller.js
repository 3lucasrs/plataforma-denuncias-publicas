const { User } = require("../models");
const { ValidationError } = require("sequelize");
const auth_service = require("../services/auth.service");

// ROTA /ME
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    user.avatarUrl = avatarUrl;
    await user.save();

    res.json({ message: "Foto de perfil atualizada com sucesso!", avatarUrl: avatarUrl });
  } catch (error) {
    console.error("ERRO NO UPLOAD DE AVATAR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, last_name, email, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        where: { email, id: { [Op.ne]: userId } },
      });
      if (emailExists) {
        return res
          .status(409)
          .json({ message: "Este e-mail já está em uso por outra conta." });
      }
    }

    user.name = name || user.name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIM ROTA /ME

// Obter todos os users
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
    console.log(`> Obtendo lista de usuários`);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter lista de usuários", error });
  }
};

// Obter user por ID
exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
      console.log(
        `> Obtendo usuário id "${user.id}" cpf "${user.cpf}" nome "${user.name} ${user.last_name}"`
      );
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuário", error });
  }
};

// Atualizar user
exports.update = async (req, res) => {
  const { name, last_name, phone, group, password /*aprovado*/ } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.name = name || user.name;
      user.last_name = last_name || user.last_name;
      user.phone = phone || user.phone;
      user.group = group || user.group;

      if (password) {
        if (password.length < 6 || password.length > 100) {
          return res
            .status(400)
            .json({ message: "A senha deve ter entre 6 e 100 caracteres." });
        }
        user.password = await auth_service.hashPassword(password);
      }

      await user.save();
      res.status(200).json(user);
      console.log(
        `> Atualizado usuário id "${user.id}" cpf "${user.cpf}" nome "${user.name} ${user.last_name}"`
      );
    } else {
      res.status(404).json({ message: "Uusário não encontrado" });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    } else {
      console.error("Erro ao atualizar usuário: ", error);
      return res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
  }
};

// Deletar user
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      console.log(
        `> Deletado usuário id "${user.id}" cpf "${user.cpf}" nome "${user.name} ${user.last_name}"`
      );
      res.status(200).json({ message: "Uusário excluido." });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário", error });
  }
};

// Listar ultimos users cadastrados
exports.getLatestRegistered = async (req, res) => {
  try {
    const latestRegisted = await User.findAll({
      attributes: ["name", "last_name", "cpf", "email", "phone"],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    res.status(200).json(latestRegisted);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os últimos usuários registrados." });
  }
};
