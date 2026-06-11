const userModel = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js")
const {uploadOnCloudinary} = require("../utils/cloudinary.js")

const registerUser = async(req,res) => {

    

    const {username , email , fullname , password} = req.body;
    if(!req.body) throw new ApiError(400 , "Body is Required..!!")

    if(!username || !email || !fullname || !password){
        throw new ApiError(400 , "All Fields Are Required..!!")
    }
    
    const isExist = await userModel.findOne({
        $or : [{ email } , { username }]
    })
    
    if(isExist) throw new ApiError(400 , "user already exist with current credentials..!!");
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage){
        coverImageLocalPath = req.files.coverImage[0];
    }

    if(!avatarLocalPath){
        throw new ApiError(400 , "avatar file is Required..!!")
    }
    console.log("avatar file is : ", avatarLocalPath)
    console.log("cover image file is : ",coverImageLocalPath)
    
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverimage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
        throw new ApiError(400 , "avatar file is Required..!!")
    }
    
    const user = await userModel.create({
        fullname,
        email,
        username,
        avatar : avatar.url,
        coverimage : coverimage?.url || "",
        password
    })

    const createdUser = await userModel.findOne(user._id).select(
        "-password -refreshToken"
    );

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered Successfully..!")
    )
}

module.exports = {
    registerUser
}