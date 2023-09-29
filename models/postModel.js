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
 *         media:
 *           type: array
 *           description: The URL or reference to an image associated with the post (required).
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
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    media: {
      type: Array,
      default: [],
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    dislike: {
      type: Array,
      default: [],
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref:'User' ,
          required: true,
        },
        // username: {
        //   type: String,
        //   required: true,
        // },
        // profile: {
        //   type: String,
        // },
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
