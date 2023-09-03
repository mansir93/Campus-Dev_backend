const express = require("express");

const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getSingleUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

router.get("/", (req, res) => {
  res.send("<h2> hey user</h2>");
});

// update user
router.put("/:id", updateUser);
// delete user
router.delete("/:id", deleteUser);
// get a user
router.get("/:id", getSingleUser);

// follow user
router.put("/:id/follow", followUser);
// unfollow user
router.put("/:id/unfollow", unfollowUser);
module.exports = router;
