const jwt = require("jsonwebtoken");
const {blackModel} = require("../models/blacklist.model");

const authMiddleware = async function(req,res,next){
        const token = req.cookies.token|| req.headers.authorization?.split(" ")[1];

        if(!token){
                return res.status(401).json({
                message:"Token is not present!Unauthorised access."
                })
        }

        const isBlacklisted = await blackModel.findOne({
                token,
        })
        if(isBlacklisted){
                return res.status(401).json({
                message:"Token is blacklisted!Unauthorised access."
                })
        }

        try{
                const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY);
                
                req.user=decoded;
                return next();
        }
        catch(err){
                return res.status(401).json({
                message:"Invalid token",
                })
        }
} 

module.exports={authMiddleware};