const express = require("express");
const { register,login } = require("../controllers/authController");

const router = require("express").Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: register
 *   description: Auth APIsI
 * /register:
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

router.post("/register", register);



router.post("/login", login);

module.exports = router;
