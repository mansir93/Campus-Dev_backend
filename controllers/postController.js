const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const base64url = require("base64url");

const sharp = require("sharp"); // Add sharp for image optimization

// createpost
exports.createPost = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { files } = req;

  if (!title || !files) {
    throw Object.assign(new Error("No Media"), { status: 404 });
  }

  const uploadedImages = [];

  for (const file of files) {
    const transformation = [
      // { width: 800, height: 600, crop: "fill" },
      { quality: "auto" },
    ];
    const base64Data = file.buffer.toString("base64");
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64Data}`,
        {
          transformation,
          resource_type: "auto",
          folder: "userPostImages",
        }
      );
      // console.log(result);
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
        asset_id: result.asset_id,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // console.log("upload image", uploadedImages);
  const newpost = await Post.create({
    user: req.user.id,
    title,
    media: uploadedImages,
  });
  if (newpost) {
    // console.log(newpost);
    res.status(201).json({
      success: true,
      newpost,
    });
  } else {
    throw Object.assign(new Error("Something went wrong"), { status: 400 });
  }
});

//update a post
exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  if (post.user.toString() !== req.user.id) {
    await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res
      .status(200)
      .json({ success: true, message: "the post has been updated" });
  } else {
    throw Object.assign(new Error("You can update only your post"), {
      status: 403,
    });
  }
});

//Delete a post
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  if (post.user.toString() === req.user.id) {
    await post.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "the post has been deleted" });
  } else {
    throw Object.assign(new Error("You can Delete only your post"), {
      status: 403,
    });
  }
});

//Like a post
exports.likePost = asyncHandler(async (req, res) => {
  3;
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  const userId = req.user.id;

  if (!post.like.includes(userId)) {
    if (post.dislike.includes(userId)) {
      await post.updateOne({ $pull: { dislike: userId } });
    }
    await post.updateOne({ $push: { like: userId } });
    return res.status(200).json("Post has been liked");
  } else {
    await post.updateOne({ $pull: { like: userId } });
    return res.status(200).json("Post has been unlike");
  }
});

//disLike a post
exports.dislikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  const userId = req.user.id;

  if (!post.dislike.includes(userId)) {
    if (post.like.includes(userId)) {
      await post.updateOne({ $pull: { like: userId } });
    }
    await post.updateOne({ $push: { dislike: userId } });
    return res.status(200).json("Post has been disliked");
  } else {
    await post.updateOne({ $pull: { dislike: userId } });
    return res.status(200).json("Post has been unlike");
  }
});

exports.commentPost = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    throw Object.assign(new Error("type comment message"), { status: 403 });
  }

  const newComment = {
    user: req.user.id,
    comment,
  };
  const post = await Post.findById(req.params.id);

  // console.log(post);

  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  post.comments.push(newComment);
  await post.save();

  res.status(200).json(post);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const { postid, commentid } = req.params;
  const post = await Post.findById(postid);

  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentid
  );

  if (commentIndex === -1) {
    throw Object.assign(new Error("comment not found"), { status: 404 });
  }
  if (post.comments[commentIndex].user.toString() !== req.user.id) {
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  }
  post.comments.splice(commentIndex, 1);

  await post.save();

  res.status(200).json(post);
});

// get endpoints
const userProjection = {
  password: 0,
  updatedAt: 0,
  isAdmin: 0,
};
//get a post
exports.getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "user",
      select: userProjection,
    })
    .populate("comments.user");
  if (!post) {
    throw Object.assign(new Error("Post not found"), { status: 404 });
  }
  res.status(200).json(post);
});

exports.getTimelinePost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  const userPosts = await Post.find({ user: user._id })
    .populate({
      path: "user",
      select: userProjection,
    })
    .populate("comments.user");
  F;

  const friendPosts = await Promise.all(
    user.followings.map(async (friendId) => {
      const friendPosts = await Post.find({ user: friendId })
        .populate({
          path: "user",
          select: userProjection,
        })
        .populate("comments.user");
      return friendPosts;
    })
  );

  const timelinePosts = [...userPosts, ...friendPosts.flat()];

  res.status(400).json(timelinePosts);
});

exports.getPostsBaseUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }

  // Fetch the user's posts
  const userPosts = await Post.find({ user: user._id })
    .populate({
      path: "user",
      select: userProjection,
    })
    .populate("comments.user");

  const friendPosts = await Promise.all(
    user.followings.map(async (friendId) => {
      const friendPosts = await Post.find({ user: friendId })
        .populate({
          path: "user",
          select: userProjection,
        })
        .populate("comments.user");
      return friendPosts;
    })
  );

  const allFriendPosts = friendPosts.flat();

  const followers = await User.find({ _id: { $in: user.followers } });
  const randomFollowerPosts = [];

  followers.forEach((follower) => {
    const randomCount = 3;
    const randomIndexes = [];

    while (randomIndexes.length < randomCount) {
      const randomIndex = Math.floor(Math.random() * follower.posts.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
        randomFollowerPosts.push(follower.posts[randomIndex]);
      }
    }
  });

  const randomPosts = await Post.aggregate([{ $sample: { size: 5 } }]);
  // .populate({
  //   path: "user",
  //   select: userProjection,
  // })
  // .populate("comments.user");

  const Posts = [
    ...userPosts,
    ...allFriendPosts,
    ...randomFollowerPosts,
    // ...randomPosts,
  ];

  res.status(200).json(Posts);
});

exports.getAllPosts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find()
    .populate({
      path: "user",
      select: userProjection,
    })
    .populate("comments.user");
  if (!allPosts) {
    throw Object.assign(new Error("something is wrong"), { status: 404 });
  }
  const randomPosts = await Post.aggregate([{ $sample: { size: 10 } }]);
  // .populate({
  //   path: "user",
  //   select: userProjection,
  // })
  // .populate("comments.user");
  // console.log(randomPosts);

  const combinedPosts = [
    ...allPosts,
    // ...randomPosts
  ];

  res.status(200).json(combinedPosts);
});
