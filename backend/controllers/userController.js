const USER = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//USER ROUTES
exports.view_Users = asyncHandler(async (req,res,next)=>{
    const users = await USER.find();
    if(req.user !== undefined){
        res.json(users);
    }
    else{
        
    }
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
                console.log(password)
                console.log(hashedPassword)
                const user = new USER({username : username, password : hashedPassword});
                await user.save();
                res.redirect("/api/view-users");
            }
        })
    }
})

exports.view_User = asyncHandler(async (req, res, next)=>{
    const user = await USER.findById(req.params.id);
    if(user){
        res.json(user);
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
})

exports.update_User = asyncHandler(async (req, res, next)=>{
    const user = await USER.findById(req.params.id);
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
                res.json(updateUser);
            }
        })
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
})

exports.delete_User = asyncHandler(async (req, res, next)=>{
    const user = await USER.findById(req.params.id);
    if(user){
        await USER.findByIdAndDelete(req.params.id);
        res.json({message : "User deleted successfully"});
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
})
