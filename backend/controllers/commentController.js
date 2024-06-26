const USER = require("../models/user");
const COMMENT = require("../models/comment");
const COMMENT_AUTH = require("../models/commentAuth");
const AUTHOR = require("../models/author");
const POST = require("../models/post");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

exports.showAllComments = asyncHandler(async (req,res,next)=>{
    const comments = await COMMENT.find();
    res.json(comments);
})

exports.createComment = asyncHandler(async (req, res, next)=>{
    const {comment_content} = req.body;
    const time = new Date().getTime();
    

})

exports.showOneComment = asyncHandler(async (req, res, next) => {
    const comment = await COMMENT.findById(req.params.id);
    if(comment){
        res.json(comment);
    }
    else{
        res.status(404);
        throw new Error("Comment not found");
    }
})

exports.deleteComment = asyncHandler(async (req, res, next)=>{
    const deletedComment = await COMMENT.findByIdAndDelete(req.params.id);
})

exports.updateComment = asyncHandler(async (req, res, next)=>{

})
