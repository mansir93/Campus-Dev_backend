const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");


// createpost
exports.createPost = asyncHandler(async (req, res, next) => {
  try {
    const { title, image, video } = req.body;
    const newpost = await Post.create({
      title,
      image,
      video,
      user: req.user.id,
    });
    if (newpost) {
      res.status(201).json({
        success: true,
        newpost,
      });
    } else {
      res.status(400);
      throw new Error("something wrong");
    }
  } catch (error) {
    next(error);
  }
});

//update a post
exports.updatePost = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res
        .status(200)
        .json({ success: true, message: "the post has been updated" });
    } else {
      return res.status(403).json({ error: "You can update only your post" });
    }
  } catch (error) {
    next(error);
  }
});

//Delete a post
exports.deletePost = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.user.toString() === req.user.id) {
      await post.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "the post has been deleted" });
    } else {
      return res.status(403).json({ error: "You can Delete only your post" });
    }
  } catch (error) {
    next(error);
  }
});

//Like a post
exports.likePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
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
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
});

//disLike a post
exports.dislikePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
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
  } catch (error) {
    return res.status(500).json("Internal server error ");
  }
});

exports.commentPost = asyncHandler(async (req, res) => {
  try {
    const { comment, profile } = req.body;

    const newComment = {
      user: req.user.id,
      username: req.user.username,
      comment,
      profile,
    };
    const post = await Post.findById(req.params.id);

    console.log(post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push(newComment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.deleteComment = asyncHandler(async (req, res) => {
  try {
    const { postid, commentid } = req.params;
    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentid
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (post.comments[commentIndex].user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    post.comments.splice(commentIndex, 1);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get endpoints

//get a post
exports.getSinglePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getTimelinePost = asyncHandler(async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const userPosts = await Post.find({ user: currentUser._id });

    const friendPosts = await Promise.all(
      currentUser.followings.map(async (friendId) => {
        const friendPosts = await Post.find({ user: friendId });
        return friendPosts;
      })
    );

    const timelinePosts = [...userPosts, ...friendPosts.flat()];

    res.json(timelinePosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
