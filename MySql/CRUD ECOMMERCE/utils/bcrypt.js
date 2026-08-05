const bcrypt = require("bcrypt");


const hashPass = async (pass) => {
    try {
        return await bcrypt.hash(pass, 10);
    } catch (error) {
        return error.message
    }
}

const comparePass = async (password, hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        return error.message
    }
}

module.exports = {
    hashPass,
    comparePass
}