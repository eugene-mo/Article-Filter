const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Status = require("./status.model");

class Article extends Model {}

Article.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Article" }
);

Article.belongsTo(Status);
Status.hasMany(Article);

module.exports = Article;
