const videoModel = require("../models/video.model");
const userModel = require("../models/user.model.js");
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require("../utils/ApiError")
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const mongoose = require("mongoose");

const getAllVideo = async (req, res) => {
   try {
     const allVideo = await videoModel.find();
     if (allVideo.length <= 0) throw new ApiError(400, "no any video not found..!")
     return res
         .status(200)
         .json(new ApiResponse(201, allVideo, "Get all videos..!"))
   } catch (error) {
    throw new ApiError(500, error.message);
   }
}

const uploadVideo = async (req, res) => {
    try {
        const { title, description, isPublished } = req.body;
        console.log(req.user?._id)
        console.log(req.files)

        const userId = req.user?._id;
        const user = await userModel.findOne({ _id: userId });
        if (!user) throw new ApiError(400, "You are unauthorize to upload video you must be loggedIn..!!")

        if (!req.files?.videoFile?.[0]) {
            throw new Error("Video file is required");
        }

        if (!req.files?.thumbnail?.[0]) {
            throw new Error("Thumbnail is required");
        }
        const videoFileLocalPath = req.files?.videoFile[0]?.path;
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

        const videoLink = await uploadOnCloudinary(videoFileLocalPath);
        const thumbnailLink = await uploadOnCloudinary(thumbnailLocalPath);

        if (!videoLink || !thumbnailLink) throw new ApiError(400, "Something Went Wrong at upload video or thumbnail..!!")
        if (!title || !description || !videoLink || !thumbnailLink) throw new ApiError(400, "All Fields Require..!!")

        const video = await videoModel.create({
            title,
            description,
            isPublished,
            videoFile: videoLink.url,
            thumbnail: thumbnailLink.url,
            duration: videoLink.duration,
            owner: new mongoose.Types.ObjectId(user._id)
        });
        return res
            .status(200)
            .json(new ApiResponse(201, video, "Upload Video SuccessFully...!..!"));
    } catch (error) {
        throw new ApiError(500, error.message)
    }
}

const editVideo = async (req, res) => {
   try {
     const videoId = req.params.id;
     const { title, description, isPublished } = req.body;
 
     if (!title && !description && !isPublished) throw new ApiError(400, "Must need one field..!")
 
     const thumbnailLocalPath = req.file?.path;
     console.log(`thumbnailLocalPath : `, thumbnailLocalPath)
 
     const updates = {};
     if (title) updates.title = title;
     if (description) updates.description = description;
     if (isPublished) updates.isPublished = isPublished;
 
     let uploadThumbnail;
     if (thumbnailLocalPath)
         uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
     // console.log(`uploadThumbnail : ` ,uploadThumbnail.url )
     if (thumbnailLocalPath && !uploadThumbnail.url) throw new ApiError(400, "something error due to upload thumbnail image..!");
     updates.thumbnail = uploadThumbnail.url
 
     console.log(updates.thumbnail)
 
     const updatedVideo = await videoModel.findOneAndUpdate(
         {
             _id: videoId
         }, {
         $set: updates
     },
         {
             new: true,
         }
     )
     return res
         .status(200)
         .json(new ApiResponse(201, updatedVideo, "Update Video SuccessFully...!..!"));
   } catch (error) {
    throw new ApiError(500, error.message);
   }
}

const deletevideo = async (req, res) => {
    try {
        const videoId = req.params?.id;
        const deletevideo = await videoModel.findOneAndDelete({ _id: videoId });
        if (!deletevideo) throw new ApiError(400, "video not found for delete...!");
        return res
            .status(200)
            .json(new ApiResponse(200, "Video deleted successfully..!"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}


module.exports = {
    getAllVideo,
    uploadVideo,
    editVideo,
    deletevideo
}