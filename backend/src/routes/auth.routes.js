const express = require("express");
const authRouter = express.Router();

const { userModel } = require("../models/user.model");
const { userLogin, userRegister, userLogout, GetMe } = require("../controllers/auth.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");

authRouter.post("/register",userRegister);
authRouter.post("/login",userLogin);
authRouter.post("/logout",userLogout);

authRouter.get("/get-me",authMiddleware,GetMe);


module.exports = { authRouter };