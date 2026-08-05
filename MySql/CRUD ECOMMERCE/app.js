require("dotenv").config()
const express = require("express");
const app = express();
const port = process.env.PORT || 3500;
const cookieparser = require("cookie-parser");
const morgan = require('morgan')
const cors = require("cors")    
// Middlewares

app.use(express.json());

app.use(express.urlencoded({extended : true , limit : "16kb"}));

app.use(express.static("public"));

app.use(cookieparser());

app.use(morgan("dev"));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);



const userRoute = require("./routes/user.routes");

const orderRoute  = require("./routes/order.routes");

const productRoute = require("./routes/products.routes");

const categoryRoute = require("./routes/category.routes");

const addressRoute = require("./routes/address.routes");

const cartRoute = require("./routes/cart.routes");

const reviewRoute = require("./routes/review.routes");

const wishlistRoute = require("./routes/wishlist.routes");

const adminRoute  = require("./routes/admin.routes")

// Routes

app.use("/user" , userRoute);

app.use("/order" , orderRoute);

app.use("/product" , productRoute);

app.use("/category" , categoryRoute);

app.use("/address" , addressRoute);

app.use("/cart" , cartRoute);

app.use("/review" , reviewRoute);

app.use("/wishlist" , wishlistRoute)

app.use("/admin" , adminRoute)

app.get("/" , (req,res) => {
    res.send("hello from server")
})



app.listen(port , () => {
    console.log(`server run at port ${port}`)
})