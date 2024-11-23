const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const cacheService = require("../services/cache.service");

class Tag extends Model {}

Tag.init(
  {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { sequelize, modelName: "Tag" }
);

//caching statuses
Tag.addHook("afterCreate", async () => {
  console.log("Tag list updated and cached");
  cacheService.triggerTagsUpdate();
});

Tag.addHook("afterDestroy", async () => {
  console.log("Tag list updated and cached");
  cacheService.triggerTagsUpdate();
});

Tag.addHook("afterUpdate", async () => {
  console.log("Tag list updated and cached");
  cacheService.triggerTagsUpdate();
});

module.exports = Tag;
