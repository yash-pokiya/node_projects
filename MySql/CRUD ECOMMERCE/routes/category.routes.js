const express = require("express");
const {authMiddleware , adminAuth} = require("../middlewares/auth.middleware");
const {createCategory , allCategories , updateCategory , deleteCategory} = require("../controllers/category.controller")

const router = express.Router();

router.post("/create" , adminAuth , createCategory);

router.get("/categories" , allCategories);

router.put("/update/:id" , adminAuth , updateCategory);

router.delete("/delete/:id" , adminAuth , deleteCategory)

module.exports = router;