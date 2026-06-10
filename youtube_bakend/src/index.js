require("dotenv").config()
const port = process.env.PORT || 4000;
const { dbConnect } = require("./db/index");
const { app } = require("./app");


dbConnect()
    .then(() => {
        app.listen(port, () => {
            console.log(`server run at port ${port}`);
        })
    })
    .catch((err) => {
        console.log(`MongoDb connection error : ${err}`)
    })


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