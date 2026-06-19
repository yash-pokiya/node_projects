const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js")

const jwtVerify = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized..!");

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userId = decode?._id;

    const user = await userModel.findOne({ _id: userId }).select(" -password -refreshToken");
    if (!user) throw new ApiError(401, "Invalid AccessToken")

    req.user = user;
    next();
  } catch (error) {
    throw error
  }
}

module.exports = jwtVerify;