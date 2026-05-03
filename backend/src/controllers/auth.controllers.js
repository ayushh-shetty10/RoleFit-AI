const { blackModel } = require("../models/blacklist.model.js");
const {userModel} = require("../models/user.model.js");
const jwt = require("jsonwebtoken");


/**
 * @route POST/api/auth/register
 * @description registers user.
 * @access PUBLIC
 */
const userRegister = async(req,res)=>{

    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(402).json({
            message:"Please enter username,email and password."
        })
    }

    const userAlrExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    });

    if(userAlrExists){
        return res.status(402).json({
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

    res.cookie("token",token);

    return res.status(201).json({
        message:"User registered successfully!",
        user:{
            username:user.username,
            email:user.email,

        },
        token,
    })
   
}
/**
 * @route POST/api/auth/login
 * @description login user.
 * @access PUBLIC
 */
const userLogin=async(req,res)=>{
        const {password,email}=req.body;


        const user= await userModel.findOne({
                email,
        }).select("+password");;

        if(!user){
            return res.status(404).json({
                message:"INVALID CREDENTIALS.",
        });
    }

        const CorrectPass = await user.comparePassword(password);

        if(!CorrectPass){
            return res.status(404).json({
                message:"INVALID CREDENTIALS.",
        });
        }

        const token =await jwt.sign({
            Id:user._id,
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"7d",
        })
  
        res.cookie("token",token);

        res.status(201).json({
            message:"Login successfully!",
            user:{
                username:user.username,
                email:user.email,
                
            },
            token,
        });

    
};

/**
 * @route POST/api/auth/logout
 * @description logout user.
 * @access PUBLIC
 */
const userLogout=async (req,res)=>{
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
        message :"logged out successfully"
    })
    
}

/**
 * @route GET/api/auth/get-me
 * @description Gets the loggedIn user details.
 * @access private
 */
const GetMe = async (req,res)=>{
    const user = await userModel.findOne({_id:req.user.Id});
    return res.status(200).json({
        message:"User data:",
        user:{
            userId:user._id,
            username:user.username,
            email:user.email,
        }
    })
}




module.exports={userLogin,userRegister,userLogout,GetMe}