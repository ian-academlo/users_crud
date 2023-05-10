// importamos express
const express = require("express");
const db = require("./utils/database");
const Users = require("./models/users.model");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

db.authenticate() // es una función asincrona
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.log(err));

db.sync() // si la tabla no existe la crea...
  .then(() => console.log("Base de datos sincronizada"))
  .catch((error) => console.log(error));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// axios.post(url, {firstname, lastaname, email, password}); body
// INSERT INTO users (firstname, lastname, email, password) VALUES ()

// una petición -> POST localhost:8000/users
// ! C
app.post("/users", async (req, res) => {
  try {
    // extraemos el cuerpo de la peitición
    // {firstname, lastaname, email, password}
    const newUser = req.body; // epxress
    // INSERT INTO users (firstname, lastname, email, password) VALUES ()
    await Users.create(newUser);
    // respondemos con un 201 - created
    res.status(201).send();
  } catch (error) {
    // si algo sale mal respondemos con el error.
    res.status(400).json(error);
  }
});
// ! R
// obtener a todos los usuarios de la base de datos
// * SELECT * FROM users;
// Users.findAll()

// SELECT firstname, lastname, email FROM users;
// {
//   attributes: ["firstname", "lastname", "email"],
// }

// SELECT id, firstname, lastname, email, craetedAt, updatedAt FROM users;
// {
//    attributes: {
//      exclude: ['password']
//    }
// }

// ? Petición GET a localhost:8000/users
app.get("/users", async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
  }
});

// get user by id
// SELECT * FROM users WHERE id=3
app.get("/users/id/:id", async (req, res) => {
  try {
    // para recuperar el  parametro de ruta
    // * req.params
    // ? es un objeto que tiene todos los parametro de la ruta
    // ? {id: 4} -> localhost:8000/users/id/4
    const { id } = req.params;
    console.log(req.params);

    const user = await Users.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// localhost/users/parametro

// si quiero encontrar por otro campo
// encontrar a un usuario por su correo electronico?
// ? SELECT * FROM users WHERE email=valor

app.get("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await Users.findOne({
      where: { email }, // { email: email }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// eliminar un usuario
// DELETE FROM users WHERE id=3; eliminar al usuario con id = 3

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Users.destroy({
      where: { id }, // where: { id : 4 }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
});

// actualizar información de un usuario
// UPDATE users SET firstname="lkdf", lastname="sldhf" WHERE id="x"

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    await Users.update(
      { firstname, lastname },
      {
        where: { id },
      }
    );
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
});

// dejar escuchando a nuestro servidor en un puerto
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el pto ${PORT}`);
});

console.log(process.env);
