const express = require("express");
const {homeRender} = require("../controllers/controller")
const router = express.Router();


router.get("/home" , homeRender )

module.exports = router;