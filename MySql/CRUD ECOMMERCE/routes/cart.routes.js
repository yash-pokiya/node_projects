const express = require("express");
const {authMiddleware , adminAuth} = require("../middlewares/auth.middleware");
const {addToCart , getCart , updateCart , deleteCartItem , clearCart} = require("../controllers/cart.controller")

const router = express.Router();

router.post("/add" , authMiddleware , addToCart);

router.get("/view-cart" , authMiddleware , getCart);

router.put("/update" , authMiddleware , updateCart);

router.delete("/delete/:id" , authMiddleware , deleteCartItem)

router.delete("/clear" , authMiddleware , clearCart )

module.exports = router;