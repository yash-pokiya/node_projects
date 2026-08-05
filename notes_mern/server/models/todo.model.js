const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/node_tutorial")

const todoSchema = new mongoose.Schema({
    title : {
        type : String
    },
    content : {
        type : String
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
}, {timestamps : true})

module.exports = mongoose.model("Todo" , todoSchema);