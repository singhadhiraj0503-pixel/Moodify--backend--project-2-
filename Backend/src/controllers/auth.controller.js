const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require("../config/cache");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userAlreadyRegistered = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userAlreadyRegistered) {
    return res.status(400).json({
      message: "User with the same username or email already Exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User Registered Successfully !",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
  });

  res.status(200).json({
    message: "User Logged in Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User Fetched Successfully",
    user,
  });
};

const logoutUser = async (req, res) => {
  const token = req.cookies.token;

  res.clearCookie("token");

  // await blacklistModel.create({
  //   token,
  // });

  await redis.set(token, Date.now().toString(), "EX", 60 * 60);

  res.status(200).json({
    message: "Logout Successfully",
  });
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
