const express = require("express");
const {authMiddleware , adminAuth} = require("../middlewares/auth.middleware");
const {submitReview , showReviewOfProduct} = require("../controllers/review.controller")
const router = express.Router();

router.post("/product/:id" , authMiddleware , submitReview);

router.get("/product/all/:id" , showReviewOfProduct )

module.exports = router;