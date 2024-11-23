const sequelize = require("./config/db");
const Status = require("./models/status.model");
const Tag = require("./models/tag.model");

async function initDatabase() {
  try {
    // delete or not old tables data every time when container restarts
    const forceSync = process.env.DB_FORCE_SYNC;
    await sequelize.sync({ force: forceSync });

    console.log("Database synchronized.");
    if (forceSync) {
      console.log("All tables dropped and recreated.");
    } else {
      console.log("Existing tables preserved (altered if necessary).");
    }

    // default values for Tags and Statuses
    if (forceSync) {
      await Status.bulkCreate([{ name: "published" }, { name: "draft" }, { name: "archived" }]);
      await Tag.bulkCreate([{ name: "tech" }, { name: "science" }, { name: "sport" }, { name: "military" }]);

      console.log("Initial data inserted.");
    }
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
}

module.exports = initDatabase;
