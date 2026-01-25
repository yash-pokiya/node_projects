const mongoose = require("mongoose");
mongoose.set("strictQuery" , true)
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connection successful...!");
  } catch (error) {
    console.log("some issue with connectionwith db");
    console.log(error.messege);
  }
};

module.exports = dbConnection