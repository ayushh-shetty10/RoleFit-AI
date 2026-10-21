const authService = require("../services/auth/auth.service");

/**
 * @route POST /api/auth/register
 * @description Registers user.
 * @access PUBLIC
 */
const userRegister = async (req, res) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully!",
      user,
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or Email already registered." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error during registration." });
  }
};

/**
 * @route POST /api/auth/login
 * @description Login user.
 * @access PUBLIC
 */
const userLogin = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successfully!",
      user,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error during login." });
  }
};

/**
 * @route POST /api/auth/logout
 * @description Logout user.
 * @access PUBLIC
 */
const userLogout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await authService.logoutUser(token);

    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error during logout." });
  }
};

/**
 * @route GET /api/auth/get-me
 * @description Gets the loggedIn user details.
 * @access PRIVATE
 */
const GetMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user.Id;
    const user = await authService.getUserById(userId);

    return res.status(200).json({
      message: "User data:",
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  GetMe,
};