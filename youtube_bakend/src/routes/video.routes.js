const express = require("express");
const Router = express.Router();
const upload = require("../middlewares/multer.middleware.js");
const jwtVerify = require("../middlewares/auth.middleware.js")
const {
    getAllVideo,
    uploadVideo,
    editVideo
} = require("../controllers/video.controller")

Router.get("/get-all" , getAllVideo)

Router.post("/upload-video" , jwtVerify , upload.fields([
    {
        name : "videoFile",
        maxCount : 1
    },
    {
        name : "thumbnail" ,
        maxCount : 1
    }
])  , uploadVideo)

Router.post("/edit/:id" , jwtVerify , upload.single("thumbnail") , editVideo)

module.exports = Router;