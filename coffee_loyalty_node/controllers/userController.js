const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const crypto = require("crypto");

//SIGNUP
const signUpUser = async (req, res) => {
  try {
    const body = req.body;
    if (!body.userName || !body.email || !body.password) {
      return res.status(400).json({
        msg: "Username, email and password are required",
      });
    }
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already existing.!" });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const generateId = () => {
      return crypto.randomUUID().split("-")[0].toUpperCase();
    };
    let custID = generateId();

    const registerUser = await User.create({
      username: body.userName,
      customerId: custID,
      email: body.email,
      password: hashedPassword,
      age: body.age,
      gender: body.gender,
      city: body.city,
      phone: body.phone,
    });
    res.status(200).json({
      msg: "User register successfully..!",
      user: {
        id: registerUser._id,
        userName: registerUser.userName,
        email: registerUser.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "signup failed..!" });
  }
};

//LOGIN
const loginUser = async (req, res) => {
  try {
    if (req.cookies?.token) {
      return res.status(400).json({ msg: "user already loged-in...!" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Email or username and password are required!" });
    }
    const userLogin = await User.findOne({
      email
    });
    if (!userLogin) {
      return res.status(400).json({ msg: "User Not Found..!" });
    }
    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Wrong..!" });
    }
    const token = jwt.sign({ id: userLogin._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    return res.status(200).json({
      msg: "Login Success..!🐦‍🔥",
      data: {
        username: userLogin.username,
        email: userLogin.email,
        age: userLogin.age,
        gender: userLogin.gender,
        city: userLogin.city,
        phone: userLogin.phone,
        customerId: userLogin.customerId,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Login failed",
    });
  }
};

//UPDATE
const updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const {  username, age, gender } = req.body;
    console.log("BODY:", req.body);
console.log("USER:", req.user);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {  username, age, gender },
      { new: true }
    ).select("-password");
console.log("UPDATED USER FROM DB:", updatedUser);

    return res.status(200).json({
      msg: "User updated successfully!",
      data: updatedUser
    });

  } catch (error) {
    console.log({error : error.message});
    
    return res.status(500).json({ msg: "Server error" });
  }
};


//LOGOUT
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        msg: "You are not logged in",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    
    return res.status(200).json({
      msg: "User logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Logout failed",
    });
  }
};

//HOME PAGE

const homePage = (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
};
module.exports = {
  signUpUser,
  loginUser,
  logoutUser,
  homePage,
  updateUser
};
