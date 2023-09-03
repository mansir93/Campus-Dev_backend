const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// updateUser
exports.updateUser = asyncHandler(async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
exports.getSingleUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
exports.followUser = asyncHandler(async (req, res) => {
  try {
    // Validate input and permissions
    if (req.body.userId === req.params.id) {
      return res.status(403).json("You can't follow yourself");
    }
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json("User not found");
    }

    if (userToFollow.followers.includes(req.body.userId)) {
      return res.status(403).json("You already follow this user");
    }
    // Update the user documents
    await userToFollow.updateOne({ $push: { followers: req.body.userId } });
    await currentUser.updateOne({ $push: { followings: req.params.id } });

    res.status(200).json("User has been followed");
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});


//unfollow a user
exports.unfollowUser = asyncHandler(async (req, res) => {
  try {
    // Validate input and permissions
    if (req.body.userId === req.params.id) {
      return res.status(403).json("You can't unfollow yourself");
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json("User not found");
    }

    if (!userToUnfollow.followers.includes(req.body.userId)) {
      return res.status(403).json("You don't follow this user");
    }

    // Update the user documents to unfollow
    await userToUnfollow.updateOne({ $pull: { followers: req.body.userId } });
    await currentUser.updateOne({ $pull: { followings: req.params.id } });

    res.status(200).json("User has been unfollowed");
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});
