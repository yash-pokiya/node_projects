const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const createUser = async(req,res) => {
    const {username , email , password} = req.body;
    const hashedPass = await bcrypt.hash(password , 10);
    const isExist = await userModel.findOne({email});
    if(isExist) return res.status(400).json({Msg : "User already exists.!!!"});
    const user = await userModel.create({
        username ,
        email,
        password : hashedPass
    });
    return res.status(200).json({user});
}


const loginUser = async(req,res) => {
    const {email , username , password} = req.body;

    // check data 
    if( !(email || username) || !password){
        return res.status(400).json({"msg" : "Must enter username or email and password...!"});    
    }
    // Find user 
    const loginUser = await userModel.findOne({$or : [{email} , {username}]});
    if(!loginUser) return res.status(404).json({"msg" : "User not found.!!"});

    // check if user already loggedIn
    const token = req.cookies?.token
    if(token) return res.status(400).json({"msg" : "User already loggedIn..!!"});

    // compare password
    const isPassMatch = await bcrypt.compare(password , loginUser.password);
    if(!isPassMatch) return res.status(400).json({"msg" : "username , email or password not match..!!!"});

    // clear all steps and final login and generate and set cookie 
     if(loginUser) {
        const token = jwt.sign({id : loginUser._id} , process.env.JWT_SECRET , {expiresIn : "7d"});
        res.cookie("token" , token)
        return res.status(200).json({"msg" : "User login success...!", user: loginUser});
     }
}

const logOut = async(req,res) => {
    // check if cookies here 
    const token =  req.cookies?.token
    if(!token) return res.status(400).json({"msg" : "User already loggedout..!!"});
    
    // clear cookie 
    res.clearCookie("token");
    return res.status(200).json({msg : "User Logout success..!!"});
}

module.exports = {
    createUser,
    loginUser,
    logOut
}