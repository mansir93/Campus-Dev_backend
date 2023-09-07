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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }
    const userList = users.map((user) => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });
    res.status(200).json(userList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//follow a user
exports.followUser = asyncHandler(async (req, res) => {
  try {
    // Validate input and permissions
    if (req.user.id === req.params.id) {
      return res.status(403).json("You can't follow yourself");
    }
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json("User not found");
    }

    if (userToFollow.followers.includes(req.user.id)) {
      return res.status(403).json("You already follow this user");
    }
    await userToFollow.updateOne({ $push: { followers: req.user.id } });
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
    if (req.user.id === req.params.id) {
      return res.status(403).json("You can't unfollow yourself");
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json("User not found");
    }

    if (!userToUnfollow.followers.includes(req.user.id)) {
      return res.status(403).json("You don't follow this user");
    }

    await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
    await currentUser.updateOne({ $pull: { followings: req.params.id } });

    res.status(200).json("User has been unfollowed");
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal server error");
  }
});

exports.userfollowers = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const followersPromises = user.followers.map((followerId) => {
      return User.findById(followerId);
    });

    const followersUsers = await Promise.all(followersPromises);
    const followersList = followersUsers.map((followerUser) => {
      const { email, password, phonenumber, Following, Followers, ...others } =
        followerUser._doc;
      return others;
    });

    res.status(200).json(followersList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.userfollowings = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingPromises = user.Following.map((followingId) => {
      return User.findById(followingId);
    });

    const followingUsers = await Promise.all(followingPromises);

    const followingList = followingUsers.map((followingUser) => {
      const { email, password, phonenumber, Following, Followers, ...others } =
        followingUser._doc;
      return others;
    });

    res.status(200).json(followingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getSuggestedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followers = await User.find({ _id: { $in: user.followers } });
    const followings = await User.find({ _id: { $in: user.followings } });
    const suggestedUsers = [];

    followers.forEach((follower) => {
      if (!user.followings.includes(follower._id.toString())) {
        suggestedUsers.push(follower);
      }
    });

    followings.forEach((followedUser) => {
      if (!user.followings.includes(followedUser._id.toString())) {
        suggestedUsers.push(followedUser);
      }
    });

    if (suggestedUsers.length === 0) {
      return res.status(200).json({ message: "No suggested users found" });
    }

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get user to follow
exports.getUserSuggests = async (req, res) => {
  try {
    const allUser = await User.find();
    const user = await User.findById(req.user.id);
    const followinguser = await Promise.all(
      user.followings.map((item) => {
        return item;
      })
    );
    let UserToFollow = allUser.filter((val) => {
      return !followinguser.find((item) => {
        return val._id.toString() === item;
      });
    });

    let filteruser = await Promise.all(
      UserToFollow.map((item) => {
        const {
          email,
          phonenumber,
          Followers,
          Following,
          password,
          ...others
        } = item._doc;
        return others;
      })
    );

    res.status(200).json(filteruser);
  } catch (error) {}
};

