require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_NAME, DB_DEPLOY } = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize(DB_DEPLOY, { logging: false, native: false })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}`,
        {
          logging: false,
          native: false,
        }
      );

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Importar tablas:
const { Customers, Barbers, Shifts, Services, Users } = sequelize.models;

// Relaciones:

Barbers.belongsToMany(Shifts, { through: "Barbers_Shifts" });
Shifts.belongsToMany(Barbers, { through: "Barbers_Shifts" });

Customers.belongsToMany(Shifts, {
  through: "Customers_Shifts",
});
Shifts.belongsToMany(Customers, {
  through: "Customers_Shifts",
  onDelete: 'CASCADE',
});

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};

// para no tener que hacer tres tablas de turnos (una por cada barbero), se puede hacer la relacion del cliente con la tabla intermedia, de esta manera quedaria relacionado el id del cliente (1-pini) con el id del barbero (1- edgar) y el id del turno(1-lunes 10am).
