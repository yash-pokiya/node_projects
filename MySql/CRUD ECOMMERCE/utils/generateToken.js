const jwt = require("jsonwebtoken");

const generateToken = async (email, id, isAdmin) => {
    return await jwt.sign(
        {
            email,
            id,
            isAdmin
        }
        ,
        process.env.JWT_SECRET)
}

module.exports = generateToken;