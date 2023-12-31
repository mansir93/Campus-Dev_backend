const express = require("express");
const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  userProfile,
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUsers,
  getUserSuggests,
  followUser,
  unfollowUser,
  userfollowers,
  userfollowings,
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: user
 *   description: User management
 */
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [user]
 *     responses:
 *       '200':
 *         description: Successfully user
 *       '500':
 *         description: Internal server error
 */
router.get("/profile", isAuthenticated, userProfile);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [user]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all users
 *       '500':
 *         description: Internal server error
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /user/suggestions:
 *   get:
 *     summary: Get user suggestions
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user suggestions
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '500':
 *         description: Internal server error
 */

router.get("/suggestions", isAuthenticated, getUserSuggests);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
router.put("/:id", isAuthenticated, updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
router.delete("/:id", isAuthenticated, deleteUser);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
router.get("/:id", isAuthenticated, getSingleUser);

/**
 * @swagger
 * /user/{id}/follow:
 *   put:
 *     summary: Follow a user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
router.put("/:id/follow", isAuthenticated, followUser);

/**
 * @swagger
 * /user/{id}/unfollow:
 *   put:
 *     summary: Unfollow a user
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
router.put("/:id/unfollow", isAuthenticated, unfollowUser);

/**
 * @swagger
 * /user/followers/{id}:
 *   get:
 *     summary: Get a user's followers
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user whose followers you want to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user's followers
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

router.get("/followers/:id", isAuthenticated, userfollowers);

/**
 * @swagger
 * /user/following/{id}:
 *   get:
 *     summary: Get a user's followings
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user whose followings you want to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user's followings
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

router.get("/following/:id", isAuthenticated, userfollowings);

module.exports = router;
