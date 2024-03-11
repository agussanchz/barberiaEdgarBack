const { Op } = require("sequelize");
const { Customers, Barbers, Shifts, Barbers_Shifts } = require("../database");
const moment = require("moment");

//_____________________________________________________________

const createCustomers = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      nickname,
      phoneNumber,
      services,
      user,
      shiftId,
    } = req.body;

    let shiftOfCustomers = await Shifts.findByPk(shiftId);

    if (shiftOfCustomers && shiftOfCustomers.occupied === false) {
      await shiftOfCustomers.update({ occupied: true });

      const newCustomer = await Customers.create({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        nickname: nickname.charAt(0).toUpperCase() + nickname.slice(1),
        phoneNumber,
        services,
        user,
      });

      await newCustomer.addShifts(shiftOfCustomers);
      return res.status(200).send(newCustomer);
    } else {
      return res.status(400).send("An error occurred when requesting this shift");
    }
  } catch (error) {
    console.error("Error in createCustomers", error);
    return res.status(500).send("Internal Server Error");
  }
};

//_____________________________________________________________
// HAY QUE RESOLVER COMO HACER PARA QUE LOS TURNOS FIJOS SE GUARDEN TANMBIEN EN LOS TURNOS QUE SE AGREGAN CON EL CORRER DE LOS DIAS, ESTA FUNCION LOGRA GUARDAR EN TODOS LOS TURNOS EXISTENTES QUE COINCIDAN PERO LOS FUTUROS QUE AUN NO EXISTEN QUEDAN EXCENTOS.

const createRegularCustomers = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      nickname,
      phoneNumber,
      services,
      user,
      day,
      barber,
    } = req.body;

    let newCustomer = await Customers.create({
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      nickname: nickname.charAt(0).toUpperCase() + nickname.slice(1),
      phoneNumber,
      services,
      user,
    });

    let shiftsOfCustomers = await Shifts.findAll({
      where: {
        day,
        barber,
      },
    });

    await newCustomer.addShifts(shiftsOfCustomers);

    return res.status(200).send(newCustomer);
  } catch (error) {
    console.error("Error in createRegularCustomers", error);
  }
};

//_____________________________________________________________

const getCustomers = async (req, res) => {
  try {
    await deleteOldCustomers();

    const { user, searchbar } = req.query;
    let customers;
    const whereClause = {};

    if (user) {
      whereClause.user = user;
    }
    if (searchbar) {
      whereClause[Op.or] = {
        firstName: { [Op.iLike]: `%${searchbar}%` },
        lastName: { [Op.iLike]: `%${searchbar}%` },
        nickname: { [Op.iLike]: `%${searchbar}%` },
      };
    }

    customers = await Customers.findAll({
      where: whereClause,
      include: {
        model: Shifts,
        order: [
          ["time", "DESC"],
          ["date", "ASC"],
        ],
        include: {
          model: Barbers,
        },
      },
    });

    return res.status(200).send(customers);
  } catch (error) {
    console.error("Error in getCustomers", error);
    return res.status(500).send("Error retrieving customers");
  }
};

//_____________________________________________________________

const getCustomersId = async (req, res) => {
  try {
    await deleteOldCustomers();

    let customers = await Customers.findByPk(req.params.id);
    return res.status(200).send(customers);
  } catch (error) {
    console.error("Error in getCustomersId", error);
  }
};

//_____________________________________________________________

const editCustomers = async (req, res) => {
  try {
    await Customers.update(req.body, { where: { id: req.params.id } });
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in editCustomers", error);
  }
};

//_____________________________________________________________

const deleteCustomers = async (req, res) => {
  try {
    await Customers.destroy({ where: { id: req.params.id } });
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in deleteCustomers", error);
  }
};

//_____________________________________________________________

const deleteOldCustomers = async () => {
  try {
    const currentDate = moment();

    const oldCustomers = await Customers.findAll({
      where: {
        [Op.and]: [
          Sequelize.literal('`Shifts` IS NOT NULL'),
          Sequelize.literal('`Shifts.id` IS NULL'),
        ],
      },
      include: {
        model: Shifts,
        required: false,
      },
    });

    for (const customer of oldCustomers) {
      await customer.destroy();
    }
  } catch (error) {
    console.error("Error in deleteOldCustomers", error);
  }
};

module.exports = {
  createCustomers,
  createRegularCustomers,
  getCustomers,
  getCustomersId,
  editCustomers,
  deleteCustomers,
};
