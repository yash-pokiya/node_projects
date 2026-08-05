const express = require("express");
const {authMiddleware , adminAuth} = require("../middlewares/auth.middleware");
const {createOrder , seeOrders , checkAllOrders , updateOrderStatus} = require("../controllers/order.controller")
const router = express.Router();



router.get("/see-order" , authMiddleware , seeOrders);

router.get("/check-all" , adminAuth ,  checkAllOrders);

router.post("/create/:id" , authMiddleware , createOrder);

router.put("/status/:id" , authMiddleware , updateOrderStatus)

module.exports = router;