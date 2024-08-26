const COMMENTAUTHOR = require("../models/commentAuth");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

exports.viewCommentAuth = asyncHandler(async (req, res)=>{
    const {author_id} = req.body;
    const check = await COMMENTAUTHOR.find({_id : author_id});
    if(check){
        res.status(200).json({check});
    }
    else{
        res.status(404).json({message : "No author found for the requested comment"});
    }
})
