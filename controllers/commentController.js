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
    const {comment_content, postId} = req.body;
    const time = new Date().getTime();
    const user = req.user;
    const idOfUser = user.id;
    let commentAuthor;
    const testForUser = await COMMENT_AUTH.findOne({user : idOfUser});
    const testForAuthor = await COMMENT_AUTH.findOne({author : idOfUser});
    if(testForUser || testForAuthor){
        commentAuthor = testForUser || testForAuthor ? testForUser : testForAuthor;
    }
    else{
        const newAuthor = new COMMENT_AUTH({user : idOfUser});
        await newAuthor.save();
        commentAuthor = newAuthor._id;
    }
    const newComment = new COMMENT({
        comment_content : comment_content,
        author : commentAuthor,
        post : postId,
        time : time
    });
    await newComment.save();
    res.status(200).json({"message" : "comment added", newComment});
})

exports.showOneComment = asyncHandler(async (req, res, next) => {
    const comment = await COMMENT.findById(req.params.id);
    if(comment){
        res.json({comment});
    }
    else{
        res.status(404);
        throw new Error("Comment not found");
    }
})

exports.deleteComment = asyncHandler(async (req, res, next)=>{
    const {id} = req.body;
    const comment = await COMMENT.findById(id);
    if(comment){
        if(comment.author == req.user._id){
            const deletedComment = await COMMENT.findByIdAndDelete(req.params.id);
            res.json({"message" : "deleted successfully", deletedComment})
        }
        else{
            res.status(401).json({message : "Unauthorised to delete"})
        }
    }
})

exports.updateComment = asyncHandler(async (req, res, next)=>{
    const {comment_content} = req.body;
    const {id} = req.params;
    const comment = await COMMENT.findById(id);
    if(comment){
        if(comment.author == req.user._id){
            comment.comment_content = comment_content
            const updateComment = await COMMENT.findByIdAndUpdate(id, comment);
            res.json({"message" : "updated comment", updateComment});
        }
        else{
            res.status(401).json({message : "Unauthorised to update"})
        }
    }
})
