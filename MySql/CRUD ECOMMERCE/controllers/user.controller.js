const db = require("../configs/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const { comparePass, hashPass } = require("../utils/bcrypt");

const register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    if (!fullname || !username || !email || !password) {
      return res.status(200).json({ msg: "All fields must be required..!" });
    }
    
    if (password.length < 6) {
      return res.status(200).json({ msg: "passwoth must be ..!" });
    }
    const hash = await hashPass(password);
    const [registerUser] = await db.execute(
      `
                INSERT INTO users( fullname , username , email , password  )
                VALUES(? , ? , ? , ? )
            `,
      [fullname, username.trim(), email, hash, ],
    );

    return res.status(200).json({
      msg: "User register successfully..!",
      "Created User": {
        id: registerUser.insertId,
        fullname,
        username,
        email,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ msg: "Email or username and password Must be required..!" });
    }
    const [users] = await db.execute(
      `
         SELECT * FROM users
         WHERE email = ? OR username = ?
         `,
      [email ?? null, username ?? null],
    );

    const loginUser = users[0];
    if (!loginUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isPassMatch = await comparePass(password, loginUser.password);

    if (!isPassMatch) {
      return res.status(400).json({
        msg: "Email OR Username OR Password Not Match..!",
      });
    }
    const token = await generateToken(
      loginUser.email,
      loginUser.id,
      loginUser.isAdmin,
    );
    return res
      .status(200)
      .cookie("token", token)
      .json({
        msg: "User Login Successfully..!",
        loginuser: {
          id: loginUser.insertId,
          email: loginUser.email,
          username: loginUser.username,
        },
      });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(200).json({ msg: "Require atleast one fiend..!" });
    }
    const { fullname, username, email } = req.body;

    const userId = req.user.id;

    const [updatedUser] = await db.execute(
      `
            UPDATE users
            SET 
                fullname = COALESCE(? , fullname),
                username = COALESCE(? , username),
                email = CoALESCE(? , email)
                WHERE id = ?
            `,
      [fullname ?? null, username ?? null, email ?? null, userId],
    );

    return res.status(200).json({
      msg: "User Updated successfull..!",
      note: "Return only the updated fields...!",
      updatedUser: {
        username: username ?? null,
        fullname: fullname ?? null,
        email: email ?? null,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const logOut = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({ msg: "logout successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ msg: "User Not LoggedIn..!" });
    const [user] = await db.execute(
      `
            SELECT username , email , fullname 
            FROM users
            WHERE id = ?
            `,
      [userId],
    );
    if (!user) return res.status(404).json({ msg: "User Not found..!" });
    const deleteduser = await db.execute(
      `
            DELETE FROM users
            WHERE id = ?
            `,
      [userId],
    );
    return res
      .status(200)
      .clearCookie("token")
      .json({
        msg: "User delete successfull..!",
        deletedUser: { deleteUser: user, userId },
      });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [user] = await db.execute(
      `
         SELECT 
             fullname,
             username,
             email,
             isAdmin
         FROM users
         WHERE id = ?
         `,
      [userId],
    );
     return res.status(200).json({
      user
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  logOut,
  deleteUser,
  userProfile
};
