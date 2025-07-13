const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resposta = sequelize.define("Response", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  complaintId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Resposta;
