const express = require("express");
const {authMiddleware , adminAuth} = require("../middlewares/auth.middleware");
const {salesState , userStates , topProducts} = require("../controllers/admin.controller")

const router = express.Router();

router.get("/stats/sales" , adminAuth , salesState);

router.get("/stats/users" , adminAuth , userStates);

router.get("/stats/top-products" , adminAuth , topProducts)

module.exports = router;