const { Op } = require("sequelize");
const Article = require("../models/article.model");

const getArticles = async (req, res) => {
  try {
    const { title, author, tags, status, dateRange, minViews, maxViews, page = 1, limit = 10, sortBy = "createdAt", order = "asc" } = req.query;

    const where = {};

    // Фильтр по названию (частичное совпадение)
    if (title) where.title = { [Op.iLike]: `%${title}%` };

    // Фильтр по автору
    if (author) where.author = { [Op.iLike]: `%${author}%` };

    // Фильтр по тегам (любое из указанных)
    if (tags) where.tags = { [Op.overlap]: tags.split(",") };

    // Фильтр по статусу
    if (status) where.status = status;

    // Фильтр по диапазону дат
    if (dateRange) {
      const [from, to] = dateRange.split(",");
      if (from && to) {
        where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };
      } else if (from) {
        where.createdAt = { [Op.gte]: new Date(from) };
      } else if (to) {
        where.createdAt = { [Op.lte]: new Date(to) };
      }
    }

    // Фильтр по минимальному и максимальному количеству просмотров
    if (minViews) where.views = { [Op.gte]: +minViews };
    if (maxViews) where.views = { ...where.views, [Op.lte]: +maxViews };

    // Пагинация
    const offset = (page - 1) * limit;

    // Проверка сортировки
    const validSortFields = ["createdAt", "views"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sortBy field" });
    }
    if (!["asc", "desc"].includes(order.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid order parameter (use "asc" or "desc")' });
    }

    // Получение данных с учетом фильтров, пагинации и сортировки
    const articles = await Article.findAll({
      where,
      offset,
      limit: +limit,
      order: [[sortBy, order.toUpperCase()]],
    });

    // Ответ с данными
    res.json({
      data: articles,
      pagination: {
        page: +page,
        limit: +limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addArticle = async (req, res) => {
  try {
    const { title, author, tags, createdAt, status, views } = req.body;

    // Проверка обязательных полей
    if (!title || !author || !status) {
      return res.status(400).json({ error: 'Fields "title", "author", and "status" are required.' });
    }

    // Валидация статуса статьи
    const validStatuses = ["published", "draft", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Valid values are: ${validStatuses.join(", ")}` });
    }

    // Создание новой статьи
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

    // Проверяем, существует ли статья
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Удаляем статью
    await article.destroy();

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addArticle, getArticles, deleteArticle };
