const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;
const tokenExpiry = process.env.JWT_EXPIRES_IN;

exports.hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
};

exports.authenticate = async (cpf, email, password) => {
  let user;

  if (cpf) {
    user = await User.findOne({ where: { cpf } });
  } else if (email) {
    user = await User.findOne({ where: { email: email } });
  }

  if (!user) {
    throw new Error("userNotFound");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("incorrectPassword");
  }

  return jwt.sign(
    {
      userId: user.id,
      admin: user.admin,
      name: user.name,
      last_name: user.last_name,
      avatarUrl: user.avatarUrl,
    },
    secretKey,
    {
      expiresIn: tokenExpiry,
      algorithm: "HS256",
    }
  );
};
