const { ValidationError, Op, Sequelize } = require("sequelize");
const auth_service = require("../services/auth.service");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { sendPasswordResetEmail } = require("../services/mail.service");

require("dotenv").config();

exports.register = async (req, res) => {
  const { name, last_name, cpf, email, phone, password } = req.body;

  const missingFields = [];
  if (!name) missingFields.push("Nome");
  if (!last_name) missingFields.push("Sobrenome");
  if (!cpf) missingFields.push("Cpf");
  if (!email) missingFields.push("E-mail");
  if (!phone) missingFields.push("Telefone");
  if (!password) missingFields.push("Senha");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Campos obrigatórios faltando: ${missingFields.join(", ")}`,
    });
  }

  try {
    // Verificar se o Cpf ou o E-mail já existem no db
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ cpf }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.cpf === cpf) {
        return res.status(400).json({ message: "CPF já está cadastrado." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "E-mail já está cadastrado." });
      }
    }

    // Validar formato do e-mail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "E-mail inválido." });
    }

    // Verificar se o e-mail já existe no db
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // Validar formato do CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      return res.status(400).json({ message: "CPF inválido." });
    }

    /*
    Esse if abaixo é necessário para que seja validado o tamanho da senha separado
    do ValidationError do Sequelize, por motivos do Sequelize validar a
    senha já criptografada e grande.
    */
    if (password.length < 6 || password.length > 100) {
      return res
        .status(400)
        .json({ message: "A senha deve ter entre 6 e 100 caracteres." });
    }

    const hashedPassword = await auth_service.hashPassword(password);

    const user = await User.create({
      name,
      last_name,
      cpf,
      email,
      phone,
      password: hashedPassword,
      admin: false,
      group: 1,
    });

    res.status(201).json({
      message: "Usuário registrado com sucesso.",
      user: {
        name: user.name,
        last_name: user.last_name,
        cpf: user.cpf,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res

        .status(400)
        .json({ message: err.errors.map((e) => e.message).join(", ") });
    } else {
      console.error("Erro ao registrar usuário: ", err);
      console.error("Detalhes do erro:", err.stack);
      return res.status(500).json({ message: "Erro ao registrar usuário." });
    }
  }
};

exports.login = async (req, res) => {
  const { cpf, email, password } = req.body;

  if ((!cpf && !email) || !password) {
    return res.status(400).json({ message: "Cpf/E-mail e senha são obrigatórios." });
  }

  try {
    const token = await auth_service.authenticate(cpf, email, password);

    // Se não tiver token então as credenciais estão erradas.
    if (!token) {
      return res.status(401).json({ message: "Cpf/E-mail ou senha incorretos." });
    }

    // Se as credenciais estiverem corretas retorna o token
    res.status(200).json({
      token: `Bearer ${token}`,
    });
  } catch (error) {
    if (error.message === "userNotFound") {
      // Erro se não encontrar usuário
      return res.status(404).json({ message: "Usuário não encontrado." });
      // Erro se o usuário estiver desativado
    } else if (error.message === "userDisabled") {
      return res.status(401).json({ message: "Usuário desativado." });
      // Erro se a senha estiver incorreta
    } else if (error.message === "incorrectPassword") {
      return res.status(401).json({ message: "Senha incorreta." });
    } else {
      // Erros inesperados
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ message: "Erro interno ao fazer login." });
    }
  }
};

// Faz a verificação passando o validateToken como middleware
exports.verifyToken = (req, res) => {
  res.status(200).json({ valid: true });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(email);
    res.status(200).json({ message: "E-mail de redefinição enviado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() }, // Token válido
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Código de redefinição inválido." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  });

  res.status(200).json({ message: "Senha redefinida com sucesso!" });
};
