import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";

//generating token
const generateToken=(userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});
    
}

//register a user
export const registerUser=async(req,res,next)=>{
    try
    {
        const{ username ,email ,password }=req.body;
        if(!username || !email || !password)
        {
            return res.status(400).json({
                success:false,
                message:"username,email & password required"
            });
        }
        if(username.length < 3)
        {
            return res.status(400).json({
                success:false,
                message:"Username must contain at least 3 characters"
            });
        }
        if(password.length < 6)
        {
            return res.status(400).json({
                success:false,
                message:"Password must contain at least 6 characters"
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
        {
            return res.status(400).json({
                success:false,
                message:"Invalid email address"
            });
        }
        const existingUser=await User.findOne({
            email:email.toLowerCase().trim()
        });

        if(existingUser)
        {
            return res.status(409).json({
                success:false,
                message:"Email already registered"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({username:username.trim(),email:email.toLowerCase.trim().toLowerCase(),password:hashedPassword});
        res.status(201).json({success:true,message:"Registration Successful",
            user:{
                id:user._id,username:user.username,email:user.email
            }
        });
    }
    catch(error)
    {
        next(error);
    }
}

//login a useer
 
export const loginUser= async(req,res,next)=>{
    try
    {
        const{ email,password }=req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message:"Email & Password are required"
            });
        }
        const user=await User.findOne({
            email:email.toLowerCase().trim()
        });
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const passwordMatch=await bcrypt.compare(password,user.password);
        if(!passwordMatch)
        {
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const token=generateToken(user._id);
        res.json({success:true,message:"Login Successful",token,
            user:{id:user._id,username:user.username,email:user.email,avatar:user.avatar}
        });
    }
    catch(error)
    {
        next(error);
    }
}

//getting current user

export const getMe = async(req,res,next)=>{
    try
    {
        res.json({success:true,user:req.user});
    }
    catch(error)
    {
        next(error);
    }
}