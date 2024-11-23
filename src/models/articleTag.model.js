const { Model } = require("sequelize");
const sequelize = require("../config/db");
const Article = require("./article.model");
const Tag = require("./tag.model");

class ArticleTag extends Model {}

ArticleTag.init({}, { sequelize, modelName: "ArticleTag" });

Article.belongsToMany(Tag, { through: ArticleTag });
Tag.belongsToMany(Article, { through: ArticleTag });

module.exports = ArticleTag;
