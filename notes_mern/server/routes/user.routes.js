const express = require("express");
const {createUser , loginUser , logOut} = require("../controller/user.controller")
const router = express.Router();

router.post("/register" , createUser);
router.post("/login" , loginUser);
router.post("/logout" , logOut)


module.exports = router;