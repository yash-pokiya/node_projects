const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createTodo , getTodo , deleteTodo , updateTodo} = require("../controller/todo.controller")

router.post("/create" , authMiddleware , createTodo );
router.get("/gettodo" , authMiddleware , getTodo)
router.delete("/delete/:id" , authMiddleware , deleteTodo)
router.patch("/update/:id" , authMiddleware , updateTodo)

module.exports = router;