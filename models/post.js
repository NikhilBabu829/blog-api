const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title : {type : String, required : true},
    content : {type : String, required : true},
    author : {type : Schema.Types.ObjectId, ref : "Author", required : true},
    time : {type : Date, required : true},
    comments : {type : Schema.Types.ObjectId, ref : "Comment"}
})

module.exports = mongoose.model("Post", postSchema)
