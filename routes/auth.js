const express = require("express");
const { register, login } = require("../controllers/authController");

const router = require("express").Router();

/** 
 * @swagger
 * 
* components:
*   schemas:
*     User:
*       type: object
*       properties:
*         username:
*           type: string
*           minLength: 3
*           maxLength: 20
*         email:
*           type: string
*           format: email
*           maxLength: 50
*         password:
*           type: string
*           minLength: 6
*         profile_pic:
*           type: string
*         cover_pic:
*           type: string
*         followers:
*           type: array
*           items:
*             type: string
*         following:
*           type: array
*           items:
*             type: string
*         isAdmin:
*           type: boolean

 */

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
router.post("/register", register);

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
