const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res
            .status(400)
            .json({ msg: "Unauthorize first make login..!" })
    }
    const decode = await jwt.decode(token, process.env.JWT_SECRET);
    
    req.user = decode;
    next();
}

const adminAuth = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res
            .status(400)
            .json({ msg: "Unauthorize first make login..!" })
    }
    const decode = await jwt.decode(token, process.env.JWT_SECRET);
    if (decode.isAdmin !== 1) {
        return res
            .status(400)
            .json({ msg: "This task only ADMIN can perform..!" })
    }
    next();
}



module.exports = {
    authMiddleware,
    adminAuth
}