require("dotenv").config();
const express = require("express");
const path = require("path")
const app = express();
const PORT = process.env.PORT || 3001 ;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "html"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDb = require("./config/db")
const urlRoute = require("./routes/urlRoute")
const  staticRoute = require("./routes/staticRoute")
connectDb();

app.use("/url" , urlRoute)

app.use("/" ,staticRoute )

app.listen(PORT, () => {
    console.log(`server run at Port ${PORT}`);
})