const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the user.
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: The username of the user (must be unique).
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 50
 *           description: The email address of the user (must be unique).
 *         phonenumber:
 *           type: number
 *           description: The user's phone number.
 *         password:
 *           type: string
 *           minLength: 6
 *           description: The hashed password of the user.
 *         profile_pic:
 *           type: string
 *           default: ""
 *           description: The URL or reference to the user's profile picture.
 *         cover_pic:
 *           type: string
 *           default: ""
 *           description: The URL or reference to the user's cover picture.
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *           description: An array of user IDs of users who are following this user.
 *         followings:
 *           type: array
 *           items:
 *             type: string
 *           default: []
 *           description: An array of user IDs of users whom this user is following.
 *         verified:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the user is verified (default is false).
 *         isAdmin:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the user has administrative privileges (default is false).
 *         desc:
 *           type: string
 *           maxLength: 50
 *           description: A short description about the user (optional).
 *         city:
 *           type: string
 *           maxLength: 50
 *           description: The user's city (optional).
 *         from:
 *           type: string
 *           maxLength: 50
 *           description: The user's place of origin (optional).
 *         relationship:
 *           type: number
 *           enum: [1, 2, 3]
 *           description: The user's relationship status, which must be one of [1, 2, 3].
 *       required:
 *         - username
 *         - email
 *         - phonenumber
 *         - password
 *         - verified
 */

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      max: 50,
      unique: true,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      min: 6,
      required: true,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    cover_pic: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    verifed: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
