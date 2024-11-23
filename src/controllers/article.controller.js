const { Op } = require("sequelize");
const Article = require("../models/article.model");
const cacheService = require("../services/cache.service");

async function getArticles(req, res) {
  try {
    const { title, author, tags, status, dateRange, minViews, maxViews, sortBy = "createdAt", sortOrder = "DESC", page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (author) where.author = { [Op.iLike]: `%${author}%` };
    if (minViews || maxViews) {
      where.views = {
        ...(minViews && { [Op.gte]: +minViews }),
        ...(maxViews && { [Op.lte]: +maxViews }),
      };
    }
    if (dateRange) {
      const { from, to } = JSON.parse(dateRange);
      where.createdAt = {
        ...(from && { [Op.gte]: new Date(from) }),
        ...(to && { [Op.lte]: new Date(to) }),
      };
    }

    // Sorting parameters
    const order = [[sortBy, sortOrder.toUpperCase()]];

    // Get tags and statuses from cache
    const availableTagNames = cacheService.getTags();
    const availableStatusNames = cacheService.getStatuses();

    // Tags filtering
    const filterTags = tags ? tags.split(",").filter((tag) => availableTagNames.includes(tag)) : [];
    const filterStatus = status && availableStatusNames.includes(status) ? status : null;

    // Check if need require statuses and tags to search
    const include = [
      {
        model: require("../models/tag.model"),
        where: filterTags.length > 0 ? { name: { [Op.in]: filterTags } } : undefined,
        required: filterTags.length > 0,
      },
      {
        model: require("../models/status.model"),
        where: filterStatus ? { name: filterStatus } : undefined,
        required: !!filterStatus,
      },
    ];

    const articles = await Article.findAndCountAll({
      where,
      include,
      order,
      limit: +limit,
      offset,
    });

    res.json({
      page: +page,
      totalPages: Math.ceil(articles.count / limit),
      totalCount: articles.count,
      articles: articles.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const addArticle = async (req, res) => {
  try {
    const { title, author, tags, createdAt, status, views } = req.body;

    if (!title || !author || !status) {
      return res.status(400).json({ error: 'Fields "title", "author", and "status" are required.' });
    }

    // check statuses from cache
    const validStatuses = cacheService.getStatuses();
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Valid values are: ${validStatuses.join(", ")}`,
      });
    }

    //check tags from cache
    const availableTags = cacheService.getTags();
    const validTags = tags ? tags.filter((tag) => availableTags.includes(tag)) : [];

    const article = await Article.create({
      title,
      author,
      tags: validTags,
      createdAt: createdAt || new Date(),
      status,
      views: views || 0,
    });

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await article.destroy();
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addArticle, getArticles, deleteArticle };
