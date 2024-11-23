const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Status = require("./status.model");
const Tag = require("./tag.model");
const Author = require("./author.model");
const ArticleTag = require("./articleTag.model");

class Article extends Model {}

Article.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, modelName: "Article" }
);

Article.belongsTo(Status);
Status.hasMany(Article);

Article.belongsTo(Author);
Author.hasMany(Article);

Article.belongsToMany(Tag, { through: ArticleTag });
Tag.belongsToMany(Article, { through: ArticleTag });

module.exports = Article;
