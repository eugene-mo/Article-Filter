const Tag = require("../models/tag.model");
const cacheService = require("../services/cache.service");

async function findAll() {
  try {
    const tags = await Tag.findAll({ attributes: ["id", "name"] });
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Unable to fetch tags from database");
  }
}

async function getTags(req, res) {
  try {
    const cachedTags = cacheService.getTags();
    if (cachedTags) {
      return res.json(cachedTags);
    }

    const tags = await findAll({ attributes: ["id", "name"] });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addTag(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Field "name" is required.' });
    }

    const existingTag = await Tag.findOne({ where: { name } });
    if (existingTag) {
      return res.status(400).json({ error: "Tag already exists." });
    }

    const tag = await Tag.create({ name });

    cacheService.triggerTagsUpdate();

    res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTag(req, res) {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found." });
    }

    await tag.destroy();

    cacheService.triggerTagsUpdate();

    res.status(200).json({ message: "Tag deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getTags, addTag, deleteTag, findAll };
