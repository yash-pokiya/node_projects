const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/node_tutorial")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
    }
} , {timestamps : true});

module.exports = mongoose.model("User" , userSchema);