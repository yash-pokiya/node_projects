const mysql2 = require("mysql2/promise");

const db =  mysql2.createPool({
        host : "localhost",
        user : "root",
        password : process.env.DB_PASSWORD,
        database : "shop",
    })

module.exports = db;