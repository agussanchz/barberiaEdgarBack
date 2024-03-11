const { Op } = require("sequelize");
const { Incomes } = require("../database");

const createIncomes = async (req, res) => {
  try {
    const { name, amount, detail } = req.body;

    let newIncome = await Incomes.create({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount,
      detail: detail.charAt(0).toUpperCase() + detail.slice(1),
    });

    return res.status(200).send(newIncome);
  } catch (error) {
    console.error("Error in createIncomes", error);
    return res.status(500).send("Internal server error");
  }
};

const getIncomes = async (req, res) => {
  try {
    const { name } = req.query;
    let income;
    if (name) {
      income = await Incomes.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        order: [["name", "ASC"]],
      });
    } else {
      income = await Incomes.findAll({
        order: [["name", "ASC"]],
      });
    }

    return res.status(200).send(income);
  } catch (error) {
    console.error("Error in getIncomes", error);
    return res.status(500).send("Internal server error");
  }
};

const getIncomesById = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await Incomes.findByPk(id);

    if (!income) {
      return res.status(404).send("Income not found");
    }

    return res.status(200).send(income);
  } catch (error) {
    console.error("Error in getIncomesById", error);
    return res.status(500).send("Internal server error");
  }
};

const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, detail } = req.body;

    await Incomes.update({ name, amount, detail }, { where: { id } });

    const updatedIncome = await Incomes.findByPk(id);

    if (!updatedIncome) {
      return res.status(404).send("Income not found");
    }

    return res.status(200).send(updatedIncome);
  } catch (error) {
    console.error("Error in updateIncome", error);
    return res.status(500).send("Internal server error");
  }
};

const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIncome = await Incomes.destroy({ where: { id } });

    if (deletedIncome === 0) {
      return res.status(404).send("Income not found");
    }

    return res.status(200).send("Income deleted successfully");
  } catch (error) {
    console.error("Error in deleteIncome", error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  createIncomes,
  getIncomes,
  getIncomesById,
  updateIncome,
  deleteIncome,
};
