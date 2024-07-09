const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    first_name : {type : String, required : true},
    last_name : {type : String,},
    cannotPost : {type : Boolean, required : true},
    username : {type : String, required : true},
    password : {type : String, required : true},
})

module.exports = mongoose.model("Author", authorSchema);    
