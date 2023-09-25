const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { json } = require("express");
const passport = require("passport");

// register
exports.register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    throw Object.assign(new Error("All fields are required"), { status: 400 });
  }
  const userAvailble = await User.findOne({ email });
  if (userAvailble) {
    throw Object.assign(new Error("user already registered"), { status: 400 });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({ user });
  } else {
    throw Object.assign(new Error("Data is not valid"), { status: 400 });
  }
});

// Callback route for Google OAuth registration
exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    console.log(user);
    if (err) {
      return next(err);
    }
    if (!user) {
    }
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log(existingUser);
    }
    // const newUser = User.create({
    //   firstname: user.firstName,
    //   lastname: user.lastName,
    //   email: user.email,
    // });
    // if (newUser) {
    //   res.status(201).json({ newUser });
    // }
  })(req, res, next);
};

// login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw Object.assign(new Error("All fields are required"), { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw Object.assign(new Error("user not found"), { status: 404 });
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
      { expiresIn: "365d" }
    );
    res.status(200).json({ token });
  } else {
    throw Object.assign(new Error("password Incorrect"), { status: 401 });
  }
});
