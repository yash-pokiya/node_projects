const express = require("express");
const {generateNewShortUrl , redirectMailUrl , viewAnalytics} = require("../controllers/controller")
const router = express.Router();

router.post("/" , generateNewShortUrl)

router.get('/:shortId' , redirectMailUrl)

router.get('/analytics/:shortId' , viewAnalytics)

module.exports = router;