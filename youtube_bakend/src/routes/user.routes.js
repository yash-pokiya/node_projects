const express = require("express");
const Router = express.Router();
const upload = require("../middlewares/multer.middleware.js");
const {registerUser} = require("../controllers/user.controller.js");


Router.post("/register" , upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
]) , registerUser)

module.exports = Router;