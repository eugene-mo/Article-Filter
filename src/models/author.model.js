const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Author extends Model {}

Author.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Author" }
);

module.exports = Author;
