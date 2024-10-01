const USER = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//USER ROUTES
exports.view_Users = asyncHandler(async (req,res,next)=>{
    const users = await USER.find();
    res.json(users);
})

exports.user_Sign_Up = asyncHandler(async (req,res,next)=>{
    const {username, password} = req.body;
    const check = await USER.findOne({username: username});
    if(check){
        res.status(400);
        throw new Error("User already exists");
    }
    else{
        bcrypt.hash(password, 10, async(err, hashedPassword)=>{
            if(err){
                res.json(err);
            }
            else{
                const user = new USER({username : username, password : hashedPassword, cannotPost : true});
                await user.save();
                res.status(200).json({"message" : "User created successfully", user});
            }
        })
    }
})

exports.view_User = asyncHandler(async (req, res, next)=>{
    const user = req.user;
    if(user){
        res.json(user);
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
})

exports.update_User = asyncHandler(async (req, res, next)=>{
    const user = req.user
    if(user){
        bcrypt.hash(req.body.password, 10, async(err, hashedPassword)=>{
            if(err){
                res.json(err);
            }
            else{
                const updateUser = {
                    username : req.body.username,
                    password :  hashedPassword
                }
                const updatedUser = await USER.findByIdAndUpdate(req.params.id, updateUser);
                res.json(updatedUser);
            }
        })
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
})

exports.delete_User = asyncHandler(async (req, res, next)=>{
    const user = req.user;
    if(user){
        await USER.findByIdAndDelete(user.id);
        res.json({message : "User deleted successfully", user});
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
})
