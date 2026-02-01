const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret

const authMiddleWare = async(req,res,next) => {
    try {
        const token = req.cookies?.token
        if(!token){
            return res.status(400).json({msg : "Unauthorizes...!"});
        }
        const decode = jwt.verify(token , jwt_secret);
        req.user = decode;
        next()
    } catch (error) {
    res.status(401).json({ error: error.messege });
    }
}

module.exports = authMiddleWare;