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
  getSinglePost,
  getTimelinePost,
} = require("../controllers/postController");

// router.get("/", (req, res) => {
//     res.send("hello")
// });

router.post("/create", isAuthenticated, createPost);
router.put("/:id", isAuthenticated, updatePost);
router.delete("/:id", isAuthenticated, deletePost);

router.put("/:id/like", isAuthenticated, likePost);
router.put("/:id/dislike", isAuthenticated, dislikePost);

router.put("/:id/comment", isAuthenticated, commentPost);
router.delete("/:postid/comment/:commentid", isAuthenticated, deleteComment);

router.get("/:id", getSinglePost);
router.get("/timeline/:id", getTimelinePost);

module.exports = router;
