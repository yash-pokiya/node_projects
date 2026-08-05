const express = require("express");
const {register , login , logOut , updateUser , deleteUser , userProfile} = require("../controllers/user.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register" , register);

router.post("/login" , login);

router.post("/edit-profile" , authMiddleware , updateUser)

router.post("/logout" , authMiddleware ,logOut)

router.get("/profile" , authMiddleware , userProfile)

router.delete("/delete-account" , authMiddleware , deleteUser)



module.exports = router;