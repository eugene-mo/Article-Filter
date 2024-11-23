const express = require("express");
const { getArticles, addArticle, deleteArticle } = require("../controllers/article.controller");
const router = express.Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Retrieve a list of articles
 *     description: Get all articles with optional filters or sorting.
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal server error.
 */
router.get("/", getArticles);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Add a new article
 *     description: Create a new article with the given details.
 *     tags:
 *       - Articles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the article.
 *                 example: "The Future of Tech"
 *               author:
 *                 type: string
 *                 description: Author of the article.
 *                 example: "John Doe"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the article.
 *                 example: ["tech", "future"]
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Creation date of the article.
 *                 example: "2024-11-23T14:00:00.000Z"
 *               status:
 *                 type: string
 *                 description: Status of the article.
 *                 example: "published"
 *                 enum: ["published", "draft", "archived"]
 *               views:
 *                 type: integer
 *                 description: Number of views for the article.
 *                 example: 100
 *     responses:
 *       201:
 *         description: Article created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad Request - Validation errors or missing fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/", addArticle);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     description: Remove an article by its ID.
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the article to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Article deleted successfully.
 *       404:
 *         description: Article not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteArticle);

module.exports = router;
