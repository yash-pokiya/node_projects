const userModel = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js")
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.message)
    }
}

const registerUser = async (req, res) => {

    try {
        const { username, email, fullname, password } = req.body;
        if (!req.body) throw new ApiError(400, "Body is Required..!!")
    
        if (!username || !email || !fullname || !password) {
            throw new ApiError(400, "All Fields Are Required..!!")
        }
    
        const isExist = await userModel.findOne({
            $or: [{ email }, { username }]
        })
    
        if (isExist) throw new ApiError(400, "user already exist with current credentials..!!");
        const avatarLocalPath = req.files?.avatar[0]?.path;
        // const coverImageLocalPath = req.files?.coverImage[0]?.path;
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage) {
            coverImageLocalPath = req.files.coverImage[0]?.path;
        }
    
        if (!avatarLocalPath) {
            throw new ApiError(400, "avatar file is Required..!!")
        }
        console.log("avatar file is : ", avatarLocalPath)
        console.log("cover image file is : ", coverImageLocalPath)
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverimage = await uploadOnCloudinary(coverImageLocalPath)
    
        if (!avatar) {
            throw new ApiError(400, "avatar file is Required..!!")
        }
    
        const user = await userModel.create({
            fullname,
            email,
            username,
            avatar: avatar.url,
            coverimage: coverimage?.url || "",
            password
        })
    
        const createdUser = await userModel.findOne(user._id).select(
            "-password -refreshToken"
        );
    
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully..!")
        )
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!email && !username) throw new ApiError(400, "username or email is required..!");
    
        const user = await userModel.findOne({
            $or: [{ email }, { username }]
        }
        )
        if (!user) throw new ApiError(400, "User Not Found..!");
    
        const isPassMatch = await user.isPasswordCorrect(password);
        if (!isPassMatch) throw new ApiError(400, "Invalid Credentials..!");
    
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    
        const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken ")
    
        const options = {
            httpOnly: true,
            secure: false
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken, "msg": "User LoggedIn Successfully..!" }))
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

const logOutUser = async (req, res) => {
   try {
     const userId = req.user._id;
     const logOutUser = await userModel.findByIdAndUpdate(userId,
         {
             $set: {
                 refreshToken: null
             }
         },
         {
             new: true
         }
     )
     const options = {
         httpOnly: true,
         secure: false
     }
 
     return res
         .status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", options)
         .json(new ApiResponse(200, {}, "User LoggedOut Successfully..!!"));
   } catch (error) {
    throw new ApiError(500, error.message);
   }
}

const refreshAccessToken = async (req, res) => {
    try {
        const incommingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodedToken) throw new ApiError(401, "Token missing..!");

        const user = await userModel.findById(decodedToken._id);

        if (!user) throw new ApiError(401, "Unauthorized request..!");

        if (incommingRefreshToken !== user.refreshToken) throw new ApiError(401, "Token Expired...!!");

        const options = {
            httpOnly: true,
            secure: false
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { "New generated tokens": accessToken, refreshToken }, "Tokens refreshed successfully..!!"))
    } catch (error) {
        throw new ApiError(500, error.message);
    }

}

const profile = async (req, res) => {
  try {
      const userId = req.user?._id;
      console.log(userId)
      const currentUser = await userModel.findById(userId);
      return res
          .status(200)
          .json(new ApiResponse(200, { currentUser }, "User Profile fetched successfully..!"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
}

const changePassword = async (req, res) => {
   try {
     const { oldPassword, newPassword, confirmPassword } = req.body;
 
     const userId = req.user?._id;
     const user = await userModel.findById(userId);
 
     if (oldPassword === newPassword) throw new ApiError(400, "oldpassword and newpassword must be different..!");
 
     if (newPassword !== confirmPassword) throw new ApiError(400, "new password not match with confirm password..!");
 
     const isMatch = await user.isPasswordCorrect(oldPassword);
     if (!isMatch) throw new ApiError(400, "Current password is wrong..!");
 
     user.password = newPassword
     await user.save({ validateBeforeSave: false });
 
     return res
         .status(200)
         .json(new ApiResponse(200, {}, "User password changed successfully..!"));
   } catch (error) {
    throw new ApiError(500, error.message);
   }
}

const updateProfile = async (req, res) => {
   try {
     const { fullName, userName, email } = req.body;
     if (!fullName && !userName && !email) throw new ApiError(400, "Must need one field to update your profile..!");
     const userId = req.user?._id;
     if (!userId) throw new ApiError(400, "user not loggedIn..!");
 
     const updateUser = await userModel.findByIdAndUpdate({ _id: userId }, {
         $set: {
             fullname: fullName,
             email,
             username: userName
         }
     }, {
         new: true
     }).select("-password -refreshToken")
 
     return res
         .status(200)
         .json(new ApiResponse(200, { "updated user": updateUser }, "User profile changed successfully..!"));
   } catch (error) {
    throw new ApiError(500, error.message);
   }
}

const updateUserAvatar = async (req, res) => {
    try {
        const avatarLocalPath = req.file?.path
        if (!avatarLocalPath) {
            throw new ApiError(400, "avatar file is Required..!!")
        }
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
    
        if (!avatar) {
            throw new ApiError(400, "avatar file is Required..!!")
        }
    
        const userId = req.user?._id;
        const user = await userModel.findByIdAndUpdate(
            {
                _id: userId
            },
            {
                $set:
                {
                    avatar: avatar.url
                }
            },
            {
                new: true
            })
        console.log(avatar.url)
        return res
            .status(200)
            .json(new ApiResponse(200, { "updated avatar": avatar.url }, "User profile avatar changed successfully..!"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

const updateUserCover = async (req, res) => {
 try {
       const coverLocalPath = req.file?.path
       if (!coverLocalPath) {
           throw new ApiError(400, "cover file is Required..!!")
       }
   
       const cover = await uploadOnCloudinary(coverLocalPath)
   
       if (!cover) {
           throw new ApiError(400, "cover file is Required..!!")
       }
   
       const userId = req.user?._id;
       const user = await userModel.findByIdAndUpdate(
           {
               _id: userId
           },
           {
               $set:
               {
                   coverimage: cover.url
               }
           },
           {
               new: true
           })
       console.log(cover.url)
       return res
           .status(200)
           .json(new ApiResponse(200, { "updated avatar": cover.url }, "User profile cover image changed successfully..!"));
 } catch (error) {
    throw new ApiError(500, error.message);
 }
}

module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    profile,
    changePassword,
    updateProfile,
    updateUserAvatar,
    updateUserCover
}