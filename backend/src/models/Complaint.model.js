const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Denuncia = sequelize.define("Complaint", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "Pending",
  },

  neighborhood: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  complement: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});

module.exports = Denuncia;
