const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cliente = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 64],
        msg: "O nome deve ter entre 2 e 64 caracteres.",
      },
    },
  },

  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 64],
        msg: "O sobrenome deve ter entre 2 e 64 caracteres.",
      },
    },
  },

  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [5, 125],
        msg: "O e-mail deve ter entre 5 e 125 caracteres.",
      },
    },
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,

    validate: {
      len: {
        args: [5, 25],
        msg: "O número de telefone deve ter entre 8 e 25 digitos.",
      },
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: "A senha deve ter no mínimo 6 caracteres.",
      },
    },
  },

  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  group: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  /*
  aprovado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  */

  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Cliente;
