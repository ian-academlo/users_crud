// importamos express
const express = require("express");
const db = require("./utils/database");
const Users = require("./models/users.model");

db.authenticate() // es una función asincrona
  .then(() => console.log("Base de datos conectada"))
  .catch((err) => console.log(err));

db.sync() // si la tabla no existe la crea...
  .then(() => console.log("Base de datos sincronizada"))
  .catch((error) => console.log(error));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// axios.post(url, {firstname, lastaname, email, password}); body
// INSERT INTO users (firstname, lastname, email, password) VALUES ()

app.post("/users", async (req, res) => {
  try {
    // extraemos el cuerpo de la peitición
    // {firstname, lastaname, email, password}
    const newUser = req.body;
    // INSERT INTO users (firstname, lastname, email, password) VALUES ()
    await Users.create(newUser);
    // respondemos con un 201 - created
    res.status(201).send();
  } catch (error) {
    // si algo sale mal respondemos con el error.
    res.status(400).json(error);
  }
});

// obtener a todos los usuarios de la base de datos
// SELECT * FROM users;
// Users.findAll()

// SELECT firstname, lastname, email FROM users;
// {
//   attributes: ["firstname", "lastname", "email"],
// }

// SELECT id, firstname, lastname, email, craetedAt, updatedAt FROM users;

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
app.get("/users/id/:id", async (req, res) => {
  try {
    // para recuperar el  parametro de ruta
    // * req.params
    // ? es un objeto que tiene todos los parametro de la ruta
    // ? {aidi: 5, user: 'Ian', id: 4}
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

app.get("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await Users.findOne({
      where: { email }, // { email: email }
    });
    console.log(user);
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
      where: { id }, // where: { id : id }
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
app.listen(8000, () => {
  console.log("Servidor escuchando en el pto 8000");
});

// servidor
// configuramos la conexión
// verificamos la conexión con bd

// nodemon --- hot reload
// dependencia de desarrollo

// react router
// localhost:3000/product/5 --> path params

// asincronismo

// promises en js
//
