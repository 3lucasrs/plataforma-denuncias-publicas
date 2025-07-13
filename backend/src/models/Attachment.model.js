const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attachment = sequelize.define("Attachment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  complaintId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Attachment;
