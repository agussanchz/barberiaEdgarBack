const {
  Barbers,
  Barbers_Shifts,
  Shifts,
  Customers,
  Barbers_Shifts_Customers,
  Services,
} = require("../database");

//_____________________________________________________________

const createServices = async (req, res) => {
  try {
    let { name, price } = req.body;

    await Services.findOrCreate({
      where: { name: name.charAt(0).toUpperCase() + name.slice(1), price },
    });

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in createServices", error);
  }
};

//_____________________________________________________________

const getServices = async (req, res) => {
  try {
    let services = await Services.findAll({
      order: [["id", "ASC"]],
    });
    return res.status(200).send(services);
  } catch (error) {
    console.error("Error in getServices", error);
  }
};

//_____________________________________________________________

const editServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const service = await Services.findByPk(id);

    if (!service) {
      return res.status(404).send("Service not found");
    }

    await service.update({
      name: name || service.name, // Si no se proporciona un nuevo nombre, se mantiene el existente
      price: price || service.price, // Si no se proporciona un nuevo precio, se mantiene el existente
    });

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in updateServices", error);
  }
};

//_____________________________________________________________

const deleteServices = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findByPk(id);

    if (!service) {
      return res.status(404).send("Service not found");
    }

    await service.destroy();

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error in deleteServices", error);
  }
};

module.exports = {
  createServices,
  getServices,
  editServices,
  deleteServices,
};
