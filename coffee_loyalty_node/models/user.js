const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    username : {
        type : String
    },
    customerId: {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    },
    city : {
        type : String
    },
    phone : {
        type : Number
    },
    points : {
        type : Number,
        default : 0
    },
    visits : {
        type : Number,
        default : 0
    }
})

const UserModel = mongoose.model("user" , UserSchema);

module.exports = UserModel;