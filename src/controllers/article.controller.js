const { Op } = require("sequelize");
const Article = require("../models/article.model");
const Tag = require("../models/tag.model");
const Status = require("../models/status.model");

async function getArticles(req, res) {
  try {
    const { title, author, tags, status, dateRange, minViews, maxViews, sortBy = "createdAt", sortOrder = "DESC", page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // фильтрация по полям
    const where = {};

    if (title) {
      where.title = { [Op.iLike]: `%${title}%` };
    }
    if (author) {
      where.author = { [Op.iLike]: `%${author}%` };
    }
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

    // параметры сортировки
    const order = [[sortBy, sortOrder.toUpperCase()]];

    // Получаем все доступные статусы и теги из базы данных
    const [availableTags, availableStatuses] = await Promise.all([
      Tag.findAll({ attributes: ["name"] }), // Получаем все теги
      Status.findAll({ attributes: ["name"] }), // Получаем все статусы
    ]);

    const availableTagNames = availableTags.map((tag) => tag.name); // Массив доступных тегов
    const availableStatusNames = availableStatuses.map((status) => status.name); // Массив доступных статусов

    // Проверка наличия переданных тегов в базе данных
    const filterTags = tags ? tags.split(",").filter((tag) => availableTagNames.includes(tag)) : [];

    // Проверка наличия переданного статуса в базе данных
    const filterStatus = status && availableStatusNames.includes(status) ? status : null;

    // фильтрация по тегам и статусу
    const include = [
      {
        model: Tag,
        where: filterTags.length > 0 ? { name: { [Op.in]: filterTags } } : undefined,
        required: filterTags.length > 0,
      },
      {
        model: Status,
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

    // Получаем все доступные статусы из базы данных
    const availableStatuses = await Status.findAll({ attributes: ["name"] });

    const validStatuses = availableStatuses.map((status) => status.name); // Массив доступных статусов
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid values are: ${validStatuses.join(", ")}` });
    }

    const article = await Article.create({
      title,
      author,
      tags: tags || [],
      createdAt: createdAt || new Date(),
      status,
      views: views || 0,
    });

    res.status(201).json(article);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addArticle, getArticles, deleteArticle };
