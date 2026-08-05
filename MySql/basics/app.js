const mysql = require("mysql2/promise");

// 1. to connect toi MySql server
// 2. we need to create a db
// 3. Then we need to create a tables
// 4. now can perform CRUD operations 



const db = async () => {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Yashpokiya@01",
        // database: "college"
    })
    return connection;
}




const start = async () => {
    try {
        const connection = await db();
        await connection.execute(`create database IF NOT EXISTS mysql_db`);
        // console.log(await connection.execute(`show databases`))
        await connection.query(`USE mysql_db`)
        await connection.execute(`
            CREATE TABLE users(
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100),
                email VARCHAR(100) NOT NULL UNIQUE
            );
            `)
    } catch (error) {
        console.log(error)
    }
}


const insert = async () => {
    try {
        const connection = await db();
        await connection.query(`USE mysql_db`)
        await connection.execute(
            "INSERT INTO users(username , email) VALUES (? , ?)",
            ["vinod", "vinod@gmail.com"]);
        console.log(`insert successfully..!`)
    } catch (error) {
        console.log(error)
    }
}

// insert()

const values = [
    ["manthan", "manthan@gmail.com"],
    ["aryan", "aryan@gmail.com"],
    ["prince", "prince@gmail.com"],
]

const insertMore = async () => {
    try {
        const connection = await db();
        await connection.query("USE mysql_db");
        await connection.query(`
                INSERT INTO users
                (username , email)
                VALUES ?
            ` , [values])

    } catch (error) {
        console.log(error.message)
    }
}

// insertMore()


const read = async () => {
    const connection = await db();
    const id = 2
    await connection.query("USE college");
    const [rows] = await connection.execute(`SELECT * FROM student `);
    console.log(rows)
}
read()


const update = async () => {
    try {
        // const username = "Dhruv Parmar";
        const id = 102
        const changes = {
            name: "prince",
            age : 18
        }
        const connection = await db();
        await connection.query(`USE college`);
        await connection.execute(
            `
            UPDATE student
            SET 
            name = COALESCE(? , name),
            marks = COALESCE(? , marks),
            location = COALESCE(? , location),
            age = COALESCE(? , age)
            where id = ?
            ` , [
                changes.name ?? null,
                changes.marks ?? null,
                changes.location ?? null,
                changes.age ?? null,
                id
            ] 
        );
    } catch (error) {
        console.log(error)
    }
}
// update()

console.log(`MySql server connected successfully..!`)