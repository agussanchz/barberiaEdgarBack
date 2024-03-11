const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Incomes",
    {
      name: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      detail: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
};
