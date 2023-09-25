const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// updateUser
exports.updateUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } else {
    throw Object.assign(new Error("You can update only your account!"), {
      status: 403,
    });
  }
});

//delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted");
  } else {
    throw Object.assign(new Error("You can delete only your account!"), {
      status: 403,
    });
  }
});

//get a user
exports.getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  const { password, updatedAt, ...other } = user._doc;
  res.status(200).json(other);
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  const userList = users.map((user) => {
    const { password, updatedAt, ...other } = user._doc;
    return other;
  });
  res.status(200).json(userList);
});

//follow a user
exports.followUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw Object.assign(new Error("You can't follow yourself"), {
      status: 403,
    });
  }
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToFollow || !currentUser) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  if (userToFollow.followers.includes(req.user.id)) {
    throw Object.assign(new Error("You already follow this user"), {
      status: 403,
    });
  }
  await userToFollow.updateOne({ $push: { followers: req.user.id } });
  await currentUser.updateOne({ $push: { followings: req.params.id } });

  res.status(200).json("User has been followed");
});

//unfollow a user
exports.unfollowUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw Object.assign(new Error("You can't unfollow yourself"), {
      status: 403,
    });
  }

  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToUnfollow || !currentUser) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  if (!userToUnfollow.followers.includes(req.user.id)) {
    throw Object.assign(new Error("You don't follow this user"), {
      status: 403,
    });
  }

  await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
  await currentUser.updateOne({ $pull: { followings: req.params.id } });

  res.status(200).json("User has been unfollowed");
});

exports.userfollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
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
});

exports.userfollowings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  const followingPromises = user.followings.map((followingId) => {
    return User.findById(followingId);
  });

  const followingUsers = await Promise.all(followingPromises);

  const followingList = followingUsers.map((followingUser) => {
    const { email, password, phonenumber, Following, Followers, ...others } =
      followingUser._doc;
    return others;
  });

  res.status(200).json(followingList);
});

//get user to follow
exports.getUserSuggests = asyncHandler(async (req, res) => {
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
      const { email, phonenumber, Followers, Following, password, ...others } =
        item._doc;
      return others;
    })
  );

  res.status(200).json(filteruser);
});
