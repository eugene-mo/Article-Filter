const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Tag extends Model {}

Tag.init(
  {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { sequelize, modelName: "Tag" }
);

module.exports = Tag;
