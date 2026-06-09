require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express");
const app = express()
const {DB_NAME} = require("../constants")

const dbConnect = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`database connect successsfully..!! DB_HOST : ${connectionInstance.connection.host}`)
        app.on("error", () => {
            console.log("ERROR:", error);
            throw error
        })
    } catch (error) {
        console.log(`error is: ${error}`)
    }
}

module.exports = {dbConnect}