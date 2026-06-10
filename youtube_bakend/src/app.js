const express = require("express");
const app = express();


app.get("/" , (req,res) => {
    return res.send("hellow world..!!!!");
})




module.exports = {app}