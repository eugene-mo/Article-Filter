const Status = require("../models/status.model");
const cacheService = require("../services/cache.service");

async function getStatuses(req, res) {
  try {
    // Try to get statuses from cache
    const cachedStatuses = cacheService.getStatuses();
    if (cachedStatuses) {
      return res.json(cachedStatuses); // Return from cache if available
    }

    // If not cached, fetch from database
    const statuses = await Status.findAll({ attributes: ["id", "name"] });
    res.json(statuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Implement findAll function
async function findAll() {
  try {
    const statuses = await Status.findAll({ attributes: ["id", "name"] });
    return statuses; // Return the found statuses
  } catch (error) {
    console.error("Error fetching statuses:", error);
    throw new Error("Unable to fetch statuses from database");
  }
}

async function addStatus(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Status name is required." });
    }

    const existingStatus = await Status.findOne({ where: { name } });
    if (existingStatus) {
      return res.status(400).json({ error: `Status "${name}" already exists.` });
    }

    const status = await Status.create({ name });

    // Update list of cached statuses
    cacheService.triggerStatusesUpdate();

    res.status(201).json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteStatus(req, res) {
  try {
    const { id } = req.params;

    // Check if status with provided id exists
    const status = await Status.findByPk(id);
    if (!status) {
      return res.status(404).json({ error: "Status not found." });
    }

    // Delete status
    await status.destroy();

    // Update list of cached statuses
    cacheService.triggerStatusesUpdate();

    res.status(200).json({ message: "Status deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getStatuses, addStatus, deleteStatus, findAll };
