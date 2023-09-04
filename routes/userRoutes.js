const express = require("express");
const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getSingleUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: user
 *   description: User management
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User update details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Include the properties you can update here
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Invalid input or update failed
 */

// update user
router.put("/:id", updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 */

// delete user
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *       '404':
 *         description: User not found
 */

// get a user
router.get("/:id", getSingleUser);

/**
 * @swagger
 * /user/{id}/follow:
 *   put:
 *     summary: Follow a user
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to follow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User followed successfully
 *       '400':
 *         description: Invalid input or follow failed
 */

// follow user
router.put("/:id/follow", followUser);

/**
 * @swagger
 * /user/{id}/unfollow:
 *   put:
 *     summary: Unfollow a user
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to unfollow
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User unfollowed successfully
 *       '400':
 *         description: Invalid input or unfollow failed
 */

// unfollow user
router.put("/:id/unfollow", unfollowUser);
module.exports = router;
