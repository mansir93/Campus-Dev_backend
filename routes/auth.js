const express = require("express");
const {
  register,
  login,
  googleCallback,
} = require("../controllers/authController");

const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const passport = require("passport");

const optimizeImage = require("../middleware/optimizeImage");

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
router.post("/register", optimizeImage, upload.single("image"), register);

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

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Successfully loged in",
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: "Not Authorized",
    });
  }
});
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
