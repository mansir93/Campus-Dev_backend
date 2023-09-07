const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The unique identifier for the user who created the post.
 *         title:
 *           type: string
 *           description: The title of the post.
 *         image:
 *           type: string
 *           description: The URL or reference to an image associated with the post (optional).
 *         video:
 *           type: string
 *           description: The URL or reference to a video associated with the post (optional).
 *         like:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs of users who liked the post.
 *         dislike:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of user IDs of users who disliked the post.
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The unique identifier for the user who posted the comment.
 *               username:
 *                 type: string
 *                 description: The username of the user who posted the comment.
 *               profile:
 *                 type: string
 *                 description: The URL or reference to the profile picture of the user who posted the comment.
 *               comment:
 *                 type: string
 *                 description: The content of the comment.
 */

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required:true
    },
    video: {
      type: String,
    },
    like: {
      type: Array,
    },
    dislike: {
      type: Array,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        profile: {
          type: String,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
