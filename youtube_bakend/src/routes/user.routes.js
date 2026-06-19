const express = require("express");
const Router = express.Router();
const upload = require("../middlewares/multer.middleware.js");
const { registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    profile,
    changePassword,
    updateProfile,
    updateUserAvatar,
    updateUserCover
} = require("../controllers/user.controller.js");

const jwtVerify = require("../middlewares/auth.middleware.js");


Router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser)

Router.post("/login", loginUser)

Router.post("/logout", jwtVerify, logOutUser)

Router.post("/refresh-access-token", jwtVerify, refreshAccessToken)

Router.get("/profile", jwtVerify, profile);

Router.patch("/password-change", jwtVerify, changePassword)

Router.patch("/edit-profile", jwtVerify, updateProfile)

Router.patch("/edit-avatar", jwtVerify, upload.single("avatar"), updateUserAvatar)

Router.patch("/edit-cover", jwtVerify, upload.single("cover"), updateUserCover)





module.exports = Router;