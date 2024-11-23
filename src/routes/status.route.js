const express = require("express");
const { getStatuses, addStatus, deleteStatus } = require("../controllers/status.controller");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Statuses
 *   description: API for managing statuses
 */

/**
 * @swagger
 * /statuses:
 *   get:
 *     summary: Get all statuses
 *     tags: [Statuses]
 *     responses:
 *       200:
 *         description: List of statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 */
router.get("/", getStatuses);

/**
 * @swagger
 * /statuses:
 *   post:
 *     summary: Add a new status
 *     tags: [Statuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the status
 *     responses:
 *       201:
 *         description: Status created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       400:
 *         description: Invalid input or status already exists
 */
router.post("/", addStatus);

/**
 * @swagger
 * /statuses/{id}:
 *   delete:
 *     summary: Delete a status
 *     tags: [Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the status to delete
 *     responses:
 *       200:
 *         description: Status deleted successfully
 *       404:
 *         description: Status not found
 */
router.delete("/:id", deleteStatus);

module.exports = router;
