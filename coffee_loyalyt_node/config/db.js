const mongoose = require("mongoose");

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connection successful.!");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = dbConnection
