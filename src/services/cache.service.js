const { EventEmitter } = require("events");
const sequelize = require("../config/db");

class CacheService {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.tags = [];
    this.statuses = [];
  }

  async init() {
    try {
      const Tag = require("../models/tag.model");
      const Status = require("../models/status.model");

      await this.updateTags(Tag);
      await this.updateStatuses(Status);

      this.eventEmitter.on("tagsUpdated", async () => {
        await this.updateTags(Tag);
      });

      this.eventEmitter.on("statusesUpdated", async () => {
        await this.updateStatuses(Status);
      });
    } catch (error) {
      console.error("Error during cache service initialization:", error);
    }
  }

  async updateTags(Tag) {
    try {
      const tags = await Tag.findAll({ attributes: ["name"] });
      this.tags = tags.map((tag) => tag.name);
      console.log("Tags updated:", this.tags);
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  }

  async updateStatuses(Status) {
    try {
      const statuses = await Status.findAll({ attributes: ["name"] });
      this.statuses = statuses.map((status) => status.name);
      console.log("Statuses updated:", this.statuses);
    } catch (error) {
      console.error("Error updating statuses:", error);
    }
  }

  getTags() {
    return this.tags;
  }

  getStatuses() {
    return this.statuses;
  }

  triggerTagsUpdate() {
    this.eventEmitter.emit("tagsUpdated");
  }

  triggerStatusesUpdate() {
    this.eventEmitter.emit("statusesUpdated");
  }
}

const cacheService = new CacheService();
module.exports = cacheService;
