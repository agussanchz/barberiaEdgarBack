const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Barbers",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
