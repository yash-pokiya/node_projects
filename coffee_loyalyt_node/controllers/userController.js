const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken")
const path = require("path")
const crypto = require("crypto");


const signUpUser = async (req, res) => {
  try {
    const body = req.body;
    if (!body.userName || !body.email || !body.password) {
      return res.status(400).json({
        msg: "Username, email and password are required"
      });
    } 
    const existingUser = await User.findOne({email : body.email});
    if(existingUser){
      return res.status(400).json({msg : "User already existing.!"})
    }
    const password = await bcrypt.hash(body.password, 10);
     const generateId = () => {
  return crypto.randomUUID().split("-")[0].toUpperCase()
};
  let custID =  generateId()

    const registerUser = await User.create({
      userName: body.userName,
      customerId : custID,
      email: body.email,
      password: password,
      age: body.age,
      gender: body.gender,
      city: body.city,
      phone: body.phone,
    });
    res.status(200).json({
      msg : "User register successfully..!",
      user: {
        id : registerUser._id,
        userName : registerUser.userName,
        email : registerUser.email
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({msg : "signup failed..!"})
  }
};

const loginUser = async (req, res) => {
  try {
      if (req.cookies?.token) {
        return res.status(400).json({ msg: "user already loged-in...!" });
      }
   
    const { email, password, username } = req.body;
    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ msg: "Email or username and password are required!" });
    }
    const userLogin =await User.findOne({
      $or: [{email : email }, {userName :username}]
    })
    if(!userLogin){
      return res.status(400).json({msg : "User Not Found..!"})
    }
    const isMatch =await bcrypt.compare(password , userLogin.password );
    if(!isMatch){
      return res.status(400).json({msg : "Password Wrong..!"})
    }
    const token = jwt.sign({id : userLogin._id} , process.env.jwt_secret , {
      expiresIn : "1d",
    })
    res.cookie ("token" , token , {
      httpOnly : true,
      sameSite : "lax",
      secure : false,
      path: "/"
    } );
    return res.status(200).json({msg : "Login Success..!🐦‍🔥" , data : {
      userName : userLogin.userName,
      email : userLogin.email,
      age : userLogin.age,
      gender : userLogin.gender,
      city : userLogin.city,
      phone : userLogin.phone ,
      customerId : userLogin.customerId, 
    }})
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      msg: "Login failed"
    });
  }
};

//LOGOUT 

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        msg: "You are not logged in"
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite : "lax",
      secure : false,
      path: "/"
    });

    return res.status(200).json({
      msg: "User logout successful"
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Logout failed"
    });
  }
};


//HOME PAGE 

const homePage = (req,res) => {
  res.sendFile(path.join(__dirname, "public" , "html" , "index.html"))
}
module.exports = {
  signUpUser,
  loginUser,
  logoutUser,
  homePage
};
