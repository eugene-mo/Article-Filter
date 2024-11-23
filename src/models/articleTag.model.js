const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ArticleTag = sequelize.define("ArticleTag", {
  articleId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Articles",
      key: "id",
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Tags",
      key: "id",
    },
  },
});

module.exports = ArticleTag;
