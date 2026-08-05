const express = require("express");
const {  authMiddleware } = require("../middlewares/auth.middleware");
const {addToWishlist , seeWishlist , removeItem} = require("../controllers/wishlist.controller")
const route = express.Router();

route.post("/add/:id" , authMiddleware ,addToWishlist);

route.get("/see" , authMiddleware , seeWishlist);

route.delete("/remove/:id" , authMiddleware , removeItem)

module.exports = route;