const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const cacheService = require("../services/cache.service");

class Status extends Model {}

Status.init(
  {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { sequelize, modelName: "Status" }
);

//caching statuses
Status.addHook("afterCreate", async () => {
  console.log("Status list updated and cached");
  cacheService.triggerStatusesUpdate();
});

Status.addHook("afterDestroy", async () => {
  console.log("Status list updated and cached");
  cacheService.triggerStatusesUpdate();
});

Status.addHook("afterUpdate", async () => {
  console.log("Status list updated and cached");
  cacheService.triggerStatusesUpdate();
});

module.exports = Status;
