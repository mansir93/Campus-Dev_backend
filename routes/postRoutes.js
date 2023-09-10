const express = require("express");
const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  commentPost,
  deleteComment,
  getAllPosts,
  getSinglePost,
  getPostsBaseUser,
  getTimelinePost,
} = require("../controllers/postController");

/**
 * @swagger
 * tags:
 *   name: post
 *   description: post management
 */

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Create a new user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User post details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Sample Post"
 *             image: "https://example.com/sample-image.jpg"
 *             video: "https://example.com/sample-video.mp4"
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the post creation was successful.
 *                 newpost:
 *                   $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid input or post creation failed
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '500':
 *         description: Internal server error
 */
router.post("/create", isAuthenticated, createPost);

/**
 * @swagger
 * /post/explore:
 *   get:
 *     summary: Get all posts for exploration
 *     tags: [post]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all posts for exploration
 *       '500':
 *         description: Internal server error
 */

router.get("/explore", getAllPosts);

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get posts for the user's base feed
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved posts for the user's base feed
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '500':
 *         description: Internal server error
 */
router.get("/", isAuthenticated, getPostsBaseUser);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated post details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Include the properties you can update here
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", isAuthenticated, updatePost);

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Post deleted successfully
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", isAuthenticated, deletePost);

/**
 * @swagger
 * /post/{id}/like:
 *   put:
 *     summary: Like a user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to like
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Post liked successfully
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id/like", isAuthenticated, likePost);

/**
 * @swagger
 * /post/{id}/dislike:
 *   put:
 *     summary: Dislike a user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to dislike
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Post disliked successfully
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id/dislike", isAuthenticated, dislikePost);

/**
 * @swagger
 * /post/{id}/comment:
 *   put:
 *     summary: Comment on a user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to comment on
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text of the comment.
 *               profile:
 *                 type: string
 *                 description: The URL or reference to the commenter's profile.
 *             required:
 *               - text
 *     responses:
 *       '200':
 *         description: Comment added successfully
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id/comment", isAuthenticated, commentPost);

/**
 * @swagger
 * /post/{postid}/comment/{commentid}:
 *   delete:
 *     summary: Delete a comment on a user post
 *     tags: [post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postid
 *         description: ID of the post containing the comment
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentid
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Comment deleted successfully
 *       '401':
 *         description: Unauthorized - user is not authenticated
 *       '404':
 *         description: Post or comment not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:postid/comment/:commentid", isAuthenticated, deleteComment);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a single user post by ID
 *     tags: [post]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the post to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id", getSinglePost);

/**
 * @swagger
 * /post/timeline/{id}:
 *   get:
 *     summary: Get timeline posts for a user by ID
 *     tags: [post]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve timeline posts for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved timeline posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get("/timeline/:id", getTimelinePost);

module.exports = router;
