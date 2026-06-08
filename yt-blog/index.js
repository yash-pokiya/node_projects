const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const port  = process.env.PORT || 3000

app.set("view engine" , "ejs")
app.set("views" , path.resolve("./views"));

app.get("/" , (req,res) => {
    res.render("home")
})

app.listen( port , () => {
    console.log(`port started at ${port}`);
})