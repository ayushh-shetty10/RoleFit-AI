const jwt = require("jsonwebtoken");
const { userModel } = require("../../models/user.model");
const { blackModel } = require("../../models/blacklist.model");

/**
 * Register a new user in the system
 */
async function registerUser({ username, email, password }) {
  if (!username || !email || !password) {
    const error = new Error("Please enter username, email and password.");
    error.statusCode = 400;
    throw error;
  }

  const userAlrExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userAlrExists) {
    const error = new Error("User already exists!");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  return {
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };
}

/**
 * Authenticate existing user credentials
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error("Please enter email and password.");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 400;
    throw error;
  }

  const isCorrectPass = await user.comparePassword(password);

  if (!isCorrectPass) {
    const error = new Error("Invalid credentials.");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  return {
    user: {
      userId: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };
}

/**
 * Blacklist user token on logout
 */
async function logoutUser(token) {
  if (token) {
    await blackModel.create({ token });
  }
  return { message: "Logged out successfully" };
}

/**
 * Fetch authenticated user profile details
 */
async function getUserById(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    userId: user._id,
    username: user.username,
    email: user.email,
  };
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
};
