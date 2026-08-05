const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/node_tutorial")

const subTodoSchema = new mongoose.Schema({
        title : {
        type : String
    },
    content : {
        type : String
    },
    parent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Todo"
    }
} , {timestamps : true})

module.exports = mongoose.model("Subtodo" , subTodoSchema);