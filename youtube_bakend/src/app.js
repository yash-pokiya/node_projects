const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    Credential : true
}));

app.use(express.json({limit : "16kb"}))

app.use(express.urlencoded({extended : true , limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

app.get("/" , (req,res) => {
    return res.send("hellow world..!!!!");
})

// import routes    

const userRouter = require("./routes/user.routes");


// route declaration
app.use("/api/user" , userRouter)

module.exports = {app}