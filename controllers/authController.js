const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// register
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, phonenumber } = req.body;

  if (!username || !email || !password || !phonenumber) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailble = await User.findOne({ email });
  if (userAvailble) {
    res.status(400);
    throw new Error("user already registered");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Optimize the image before uploading to Cloudinary
  const optimizedImage = await cloudinary.uploader.upload(
    req.file.buffer.toString("base64"),
    {
      quality: "auto:best",
      width: 800,
      crop: "limit",
      format: "auto",
    }
  );

  // create user
  const user = await User.create({
    username,
    email,
    phonenumber,
    password: hashedPassword,
    profile_pic: optimizedImage.secure_url,
  });
  if (user) {
    res.status(201).json({ user });
  } else {
    res.status(400);
    throw new Error("Data is not valid");
  }
});

// login
exports.login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("user not found");
    }
    // compare password with hashPassword
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      res.status(200).json({ token });
    } else {
      res.status(401);
      throw new Error("Incorrect Logins");
    }
  } catch (error) {
    console.log('Error', error);
  }
});
