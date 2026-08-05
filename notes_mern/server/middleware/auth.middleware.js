const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {
   try {
     const token = req.cookies?.token ;
     if(!token) return res.status(400).json({msg : "Token not Found..!!!"});
 
     const decode = jwt.verify(token , process.env.JWT_SECRET);
     req.user = decode;
     next();
   } catch (error) {
    return res.status(400).json({msg : error.message});
   }
}

module.exports = auth;