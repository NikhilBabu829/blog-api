const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment_content : {type : String, required : true},
    author : {type : Schema.Types.ObjectId, ref : "CommentAuth", required : true},
    post : {type : Schema.Types.ObjectId, ref : "Post", required : true},
    time : {type : Date, required : true},
})

module.exports = mongoose.model("Comment", commentSchema);
