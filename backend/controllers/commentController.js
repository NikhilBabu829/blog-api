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

//TODO needs validation
exports.createComment = asyncHandler(async (req, res, next)=>{
    const {comment_content} = req.body;
    const time = new Date().getTime();
    const user = req.user;
    const idOfUser = user.id;
    const commentAuthor = new COMMENT_AUTH({user : idOfUser});
    await commentAuthor.save();
    const comment = {
        comment_content : comment_content,
        author : commentAuthor._id,
        time : time
    }
    const newComment = new COMMENT(comment);
    await newComment.save();
    res.status(200).json("comment added");
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

//TODO needs protection
exports.deleteComment = asyncHandler(async (req, res, next)=>{
    const deletedComment = await COMMENT.findByIdAndDelete(req.params.id);
})


//TODO needs protection
exports.updateComment = asyncHandler(async (req, res, next)=>{
    const {comment_content} = req.body;
    const {id} = req.params;
    const comment = await COMMENT.findById(id);
    comment.comment_content = comment_content
    const updateComment = await COMMENT.findByIdAndUpdate(id, comment);
    res.json("updated comment");
})

//TODO create a route where we add the newly created comment to it's appropriate route
