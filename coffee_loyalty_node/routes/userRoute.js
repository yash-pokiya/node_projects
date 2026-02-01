const express = require("express")
const {signUpUser , loginUser ,logoutUser ,updateUser} = require("../controllers/userController")
const authMiddleWare = require("../middleware/authMiddleWare")
const router = express.Router();

router.post("/signup" , signUpUser)
router.post("/login" , loginUser)
router.put("/update" , authMiddleWare , updateUser)
router.post("/logout" , logoutUser)



module.exports = router;