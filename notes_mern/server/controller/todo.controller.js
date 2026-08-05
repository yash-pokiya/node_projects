const todoModel = require("../models/todo.model");

const createTodo = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    const todo = await todoModel.create({
        title,
        content,
        user: userId
    });
    return res.status(200).json({ msg: "Todo create successfully..!!", todo });
}

const getTodo = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "User not login so you can't fetch todo's..!" })
    const todos = await todoModel.find({ user: userId });
    return res.status(200).json({ msg: "Todo fetch successfully..!!", todos });
}


const deleteTodo = async (req, res) => {
    // todo id from params 
    const todoId = req.params.id;

    // check if exist 
    const todo = await todoModel.findOne({ _id: todoId })
    if (!todo) {
        return res.status(400).json({ msg: "Todo not exist..!" });
    }

    // check note owner delete note not another user 
    const userId = req.user?.id;

    const userFromTodo = todo.user;
    if (userId == userFromTodo) {
        // delete todo
        const deletedTodo = await todoModel.findOneAndDelete({ _id: todoId });
        return res.status(200).json({ "msg": "Todo Deleted Successfully...!", deleteTodo })
    } else {
        // return with 401 status code error 
        return res.status(401).json({ "msg": "You are not own this note so you can't delete this note..!" })
    }

}


const updateTodo = async (req, res) => {
    // body
    const { title, content } = req.body;

    //empty obj for not fill any undefined value in db 
    const updatedData = {};

    if (title !== undefined) updatedData.title = title;
    if (content !== undefined) updatedData.content = content;

    // todo id from params 
    const todoId = req.params.id;

    // check if exist 
    const todo = await todoModel.findOne({ _id: todoId })
    if (!todo) {
        return res.status(400).json({ msg: "Todo not exist..!" });
    }

    // check note owner edit note no another user can edit 
    const userId = req.user?.id;

    const userFromTodo = todo.user;
    if (userId == userFromTodo) {
        // edit todo
        const editedTodo = await todoModel.findOneAndUpdate({ _id: todoId }, updatedData, { new: true });
        return res.status(200).json({ "msg": "Todo edited Successfully...!", editedTodo })
    } else {
        // return with 401 status code error 
        return res.status(401).json({ "msg": "You are not own this note so you can't edit this note..!" })
    }
}
module.exports = {
    createTodo,
    getTodo,
    deleteTodo,
    updateTodo
}