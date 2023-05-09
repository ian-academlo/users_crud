// vamos a gestionar la conexión con una base de datos
// * Importar sequelize
const { Sequelize } = require("sequelize");

// * crear una instancia de sequelize con la configuracion
// * de conexión

const db = new Sequelize({
  host: "localhost",
  database: "users_crud",
  port: 5432,
  username: "iannacus",
  password: "root",
  dialect: "postgres",
});

module.exports = db;
