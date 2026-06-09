const mongoose = require("mongoose");
const express = require("express");
const app = express()
const { DB_NAME } = require("./constants");



/*
(() => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error" , () => {
            console.log("ERROR:" , error);
            throw error 
        })
        app.listen(process.env.PORT , () => {
            console.log(`server running at port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR  : " , error.message)
    }
})()
    */