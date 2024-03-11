const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Services",
    {
      name: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );
};
