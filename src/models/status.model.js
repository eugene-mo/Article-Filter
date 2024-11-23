const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Status extends Model {}

Status.init(
  {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { sequelize, modelName: "Status" }
);

module.exports = Status;
