const POST = require("../models/post");
const asyncHandler = require("express-async-handler");

exports.createPost = asyncHandler(async (req, res)=>{
    const {title, content} = req.body;
    const time = new Date().getTime();
    const post = {
        title,
        content,
        author : "",
        time,
    }
    const createdPost = new POST(post);
    await createdPost.save();
    res.json(createdPost);
})

exports.getPosts = asyncHandler(async (req, res)=>{
    const post = await POST.findById(req.params);
    if(post){
        res.json(post);
    }
})

exports.getPost = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const post = await POST.findById(id);
    if(post){
        res.json(post);
    }
})

exports.editPost = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const post = await POST.findById(id);
    if(post){
        const {title, content, comments} = req.body;
        post.title = title;
        post.content = content;
        post.comments = comments;
        const updatedPost = await POST.findByIdAndUpdate(id, post);
        res.json(updatedPost);
    } 
})

exports.deletePost = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    const deletedPost =  await POST.findByIdAndDelete(id);
    res.json(deletedPost);
})
