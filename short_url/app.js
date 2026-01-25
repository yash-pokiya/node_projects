require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001 ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connectDb = require("./config/db")
const urlRoute = require("./routes/urlRoute")
connectDb();

app.use("/url" , urlRoute)

app.listen(PORT, () => {
    console.log(`server run at Port ${PORT}`);
})