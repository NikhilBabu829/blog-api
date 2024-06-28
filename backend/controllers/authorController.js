const AUTHOR = require("../models/author");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

exports.createAuthor = asyncHandler(async (req, res)=>{
    const {first_name, last_name, username, password} = req.body;
    const check = await AUTHOR.findOne({username: username});
    if(check){
        res.status(400).json({"message" : "User already exists"});
    } 
    else{
        bcrypt.hash(password, 10, async(err, hashedPassword)=>{
            if(err){
                res.json(err);
            }
            else{
                const author = new AUTHOR({
                    first_name,
                    last_name,
                    username,
                    password: hashedPassword
                })
                await author.save();
                res.status(200).json({"message" : "Author created successfully", author});
            }
        })
    }
})


//TODO needs protecting
exports.editAuthor = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const author = await AUTHOR.findById(id);
    if(author){
        const {first_name, last_name, username, password} = req.body;
        author.first_name = first_name;
        author.last_name = last_name;
        author.username = username;
        if(password){
            bcrypt.hash(password, 10, async(err, hashedPassword)=>{
                if(err){
                    res.json(err);
                }
                else{
                    author.password = hashedPassword;
                    const updatedAuthor = await AUTHOR.findByIdAndUpdate(id, author);
                    res.status(200).json({"message" : "Author updated successfully", updatedAuthor});
                }
            })
        }
    }
})


//TODO needs protecting
exports.deleteAuthor = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const author = await AUTHOR.findByIdAndDelete(id);
    if(author){
        res.status(200).json({"message" : "Author deleted successfully", author});
    }
})

exports.viewAuthor = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const author = await AUTHOR.findById(id);
    if(author){
        res.status(200).json(author);
    }
})

