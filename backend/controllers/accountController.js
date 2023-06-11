const { db } = require("../database/connectDB");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email='${email}'`;
    try {
      const result = await db.query(query);
      const user = result.rows[0];
      if (user) {
        try {
          const compareResult = await bcrypt.compare(password, user.password);
          if (compareResult === true) {
            req.session.email = user.email;
            req.session.username = user.username;
            console.log('Received session identifier:', req.session.username); // Log the received session identifier
            res.status(200).json({ success: true, message: "Login Successful" });
          } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Internal server error" });
        }
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  

const register = async (req, res) => {
  const { email, username, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO users(email, username, password) VALUES ('${email}', '${username}', '${hash}');`;
  console.log(query);
  try {
    await db.query(query);
    res.send("Register success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Register failed" });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.end("error");
    }
    res.end("logout");
  });
};

const showUser = async (req, res) => {
  const query = `SELECT * FROM users;`;
  try {
    const result = await db.query(query);
    const list = result.rows;
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ err: "Error retrieving user data" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM users WHERE id_user = ${id};`;
  console.log(query);
  try {
    await db.query(query);
    res.send("Account delete success");
  } catch (e) {
    res.status(500).json({ err: "Error deleting user account" });
  }
};

const addToFavorite = async (req, res) => {
  const { animeid } = req.body;
  const { username } = req.session;
  const query = `INSERT INTO userfavorite VALUES (${animeid}, '${username}');`;
  console.log(query);
  try {
    await db.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ err: "Error adding to favorites" });
  }
};

const removeFromFavorite = async (req, res) => {
    const { animeid } = req.body;
    const { username } = req.session;
    const query = `DELETE FROM userfavorite WHERE animeid = ${animeid} AND username = '${username}';`;
    console.log(query);
    try {
      await db.query(query);
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(500).json({ err: "Error removing from favorites" });
    }
  };

const getFavorite = async (req, res) => {
  const { username } = req.session;
  const query = `SELECT * FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl NATURAL JOIN animesynopsis NATURAL JOIN userfavorite WHERE username = '${username}';`;
  console.log(query);
  try {
    const result = await db.query(query);
    const list = result.rows;
    res.status(200).json(list);
  } catch (e) {
    res.status(500).json({ err: "Error retrieving favorite anime" });
  }
};

const checkSession = (req, res) => {
    if (req.session.email && req.session.username) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  };
  
  module.exports = {
    login,
    logout,
    deleteUser,
    register,
    showUser,
    addToFavorite,
    getFavorite,
    checkSession,
    removeFromFavorite,
  };
  
