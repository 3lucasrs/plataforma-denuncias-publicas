const app = require("./src/app");
const { sequelize } = require("./src/models");
require("dotenv").config();

const port = process.env.PORT;

sequelize.sync().then(() => {
  console.log("> Conectado com o Banco de Dados com sucesso!");
  app.listen(port, () => {
    console.log(`>> Servidor rodando na porta ${port}`);
  });
});
