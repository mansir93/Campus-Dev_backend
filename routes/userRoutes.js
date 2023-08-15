const express = require("express");

const router = require("express").Router();


/**
 * @swagger
 * tags:
 *   name: register
 *   description: Auth APIsI
 * /:
 *   post:
 *     summary: register a new user
 *     tags: [register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: register successfully.
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */



router.get("/", (req, res) => {
  res.send("<h2> hey user</h2>");
});

module.exports = router;
