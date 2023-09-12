const express = require("express");
const { register, login } = require("../controllers/authController");

const router = require("express").Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const optimizeImage = require('../middleware/optimizeImage');

/**
 * @swagger
 *  tags:
 *   name: Authentication
 *   description: 

* /auth/register:
*   post:
*     summary: Register a new user
*     tags:
*       - Authentication
*     requestBody:
*       description: User registration details
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 minLength: 3
*                 maxLength: 20
*               email:
*                 type: string
*                 format: email
*                 maxLength: 50
*               password:
*                 type: string
*                 minLength: 6
*     responses:
*       '201':
*         description: User successfully registered
*       '400':
*         description: Invalid input or registration failed
*
*
 */
router.post("/register",optimizeImage, upload.single('image'), register);

/**
 *  @swagger
 * /auth/login:
 *     post:
 *       summary: User login
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: User login details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   minLength: 6
 *       responses:
 *         '200':
 *           description: Login successful
 *         '401':
 *           description: Unauthorized or invalid credentials
 *
 */
router.post("/login", login);

module.exports = router;
