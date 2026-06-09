require("dotenv").config()
const express = require("express");
const {dbConnect} = require("./db/index")
const app = express();
const port = process.env.PORT || 4000;

dbConnect()

app.get("/" , (req,res) => {
    return res.send("hellow world..!!!!");
})

app.listen(port , () => {
    console.log(`server run at port ${port}`);
})

