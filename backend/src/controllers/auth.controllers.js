const { blackModel } = require("../models/blacklist.model.js");
const {userModel} = require("../models/user.model.js");
const jwt = require("jsonwebtoken");


/**
 * @route POST/api/auth/register
 * @description registers user.
 * @access PUBLIC
 */
const userRegister = async(req,res)=>{
    try {
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                message:"Please enter username, email and password."
            })
        }

        const userAlrExists = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        });

        if(userAlrExists){
            return res.status(400).json({
                message:"User already exists!"
            })
        }

        const user = await userModel.create({
            username,
            email,
            password
        })

        const token = await jwt.sign({
            id:user._id,
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message:"User registered successfully!",
            user:{
                userId:user._id,
                username:user.username,
                email:user.email,
            },
            token,
        })
    } catch(error) {
        console.error("Register Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Username or Email already registered."
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }
        return res.status(500).json({
            message: "Internal server error during registration."
        });
    }
}

/**
 * @route POST/api/auth/login
 * @description login user.
 * @access PUBLIC
 */
const userLogin=async(req,res)=>{
    try {
        const {password,email}=req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Please enter email and password."
            });
        }

        const user= await userModel.findOne({
            email,
        }).select("+password");

        if(!user){
            return res.status(400).json({
                message:"Invalid credentials.",
            });
        }

        const CorrectPass = await user.comparePassword(password);

        if(!CorrectPass){
            return res.status(400).json({
                message:"Invalid credentials.",
            });
        }

        const token = await jwt.sign({
            id:user._id,
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"7d",
        })

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message:"Login successfully!",
            user:{
                userId:user._id,
                username:user.username,
                email:user.email,
            },
            token,
        });
    } catch(error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal server error during login."
        });
    }
};

/**
 * @route POST/api/auth/logout
 * @description logout user.
 * @access PUBLIC
 */
const userLogout=async (req,res)=>{
    try {
        const token = req.cookies.token|| req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(200).json({
                message:"User logged out successfully"
            })
        }
        
        await blackModel.create({
            token,
        })

        res.clearCookie("token");

        return res.status(200).json({
            message :"Logged out successfully"
        })
    } catch(error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            message: "Internal server error during logout."
        });
    }
}

/**
 * @route GET/api/auth/get-me
 * @description Gets the loggedIn user details.
 * @access private
 */
const GetMe = async (req,res)=>{
    try {
        const userId = req.user.id || req.user.Id;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message:"User data:",
            user:{
                userId:user._id,
                username:user.username,
                email:user.email,
            }
        })
    } catch(error) {
        console.error("GetMe Error:", error);
        return res.status(500).json({
            message: "Internal server error."
        });
    }
}




module.exports={userLogin,userRegister,userLogout,GetMe}