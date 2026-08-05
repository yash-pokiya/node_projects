const express = require("express");
const {  authMiddleware } = require("../middlewares/auth.middleware");
const {addAddress , getAddress , deleteAddress} = require("../controllers/address.controller")

const route = express.Router();

route.post("/add" , authMiddleware , addAddress)

route.get("/get-all" , authMiddleware , getAddress);

route.delete("/delete/:id" , authMiddleware , deleteAddress)

module.exports = route;