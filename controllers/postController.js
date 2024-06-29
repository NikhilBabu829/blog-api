const POST = require("../models/post");
const asyncHandler = require("express-async-handler");

exports.createPost = asyncHandler(async (req, res)=>{
    const author = req.user;
    if(!author.cannotPost){
        const {title, content} = req.body;
        const userOrAuthor = req.user;
        console.log(userOrAuthor);
        const time = new Date().getTime();
        const post = {
            title,
            content,
            author : author._id,
            time,
        }
        const createdPost = new POST(post);
        await createdPost.save();
        res.json(createdPost);
    }
    else{
        res.status(401).json({message : "Unauthorized to create a post"});
    }
})

exports.getPosts = asyncHandler(async (req, res)=>{
    const posts = await POST.find();
    if(post){
        res.json(posts);
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
    const author = req.user;
    if(!author.cannotPost){
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
    }
    else{
        res.status(401).json({message : "Unauthorized to edit a post"});
    }
})

exports.deletePost = asyncHandler(async (req, res)=>{
    const author = req.user;
    if(!author.cannotPost){
        const {id} = req.params;
        const deletedPost =  await POST.findByIdAndDelete(id);
        res.json(deletedPost);
    }
    else{
        res.status(401).json({message : "Unauthorized to delete a post"});
    }
})
