require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;
const app = express();
const userRoutes = require("./routes/user.routes")
const todoRoutes = require("./routes/todo.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
    res.send("Hellow World..!!");
});

// Routes
app.use("/user" , userRoutes);
app.use("/todo" , todoRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});