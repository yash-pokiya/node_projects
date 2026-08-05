const express = require("express");
const {authMiddleware , adminAuth} = require("../middlewares/auth.middleware");
const {createProduct , getAllProduct , getOne , editProduct , deleteProduct} = require("../controllers/products.controller")

const upload = require("../middlewares/multer.middleware.js");
const router = express.Router();

router.post("/add" , adminAuth , upload.single("productImage") , createProduct);

router.get("/all" , getAllProduct);

router.get("/get/:id" , getOne);

router.post("/edit/:id" , adminAuth , upload.single("productImage") , editProduct)

router.delete("/delete/:id" , adminAuth , deleteProduct)


module.exports = router;