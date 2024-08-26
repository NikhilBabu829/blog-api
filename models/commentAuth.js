const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentAuthSchema = new Schema({
    user : {type : Schema.Types.ObjectId, ref : "User"},
    author : {type : Schema.Types.ObjectId, ref : "Author"},
})

module.exports = mongoose.model("CommentAuth", commentAuthSchema);
