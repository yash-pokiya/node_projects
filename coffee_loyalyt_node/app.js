require("dotenv").config()
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser")
const  dbConnection  = require("./config/db");
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const router = require("./routes/userRoute");
dbConnection()

const {homePage} = require("./controllers/userController")

app.use("/user" , router);
app.get("/" , homePage)

app.listen(port , () => {
    console.log(`server run at port ${port} `);
})
