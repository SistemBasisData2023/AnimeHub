const {db} = require("../database/connectDB");
const {end, send} = require("express/lib/response");
const bcrypt = require("bcrypt");
const session = require('express-session');


const login = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE email='${email}'`;
    try{
        const result = await db.query(query);
        const list = result.rows;
        if (result.rows.length > 0) {
            bcrypt.compare(password, result.rows[0].password, (err, compareResult) => {
                if (compareResult === true) {
                    req.session.email = email;
                    req.session.username = result.rows[0].username;
                    res.send("Login Successful");
                } else {
                    res.send("Login Failed");
                }
            });
        }
    }catch(err){
        console.log(err)
        res.status(500).json({err: 'Login failed'})
    }
};

const register = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const query = `INSERT INTO users(email, username, password) VALUES ('${req.body.email}', '${req.body.username}', '` + hash
                    + `');`
    console.log(query)
    try{
        const result = await db.query(query);
        const list = result.rows;
        res.send('Register success');
    }catch (err) {
        console.log(err)
        res.status(500).json({err: 'Register failed'})
    }
};

const logout = async (req, res) => {
    req.session.destroy(err => {
        if(err){
            res.end('error')
        }
        res.end('logout')
    });
};

const showUser = async (req, res) => {
    const query = `SELECT * FROM users;`
    try{
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    }catch (e) {

    }
}

const deleteUser = async(req, res) => {
    const query = `DELETE FROM users WHERE id_user = ${req.body.id};`
    console.log(query)
    try{
        db.query(query);
        res.send('Account delete success');
    }catch (e) {

    }
}

const addToFavorite = async (req, res) => {
    const query = `INSERT INTO userfavorite VALUES (${req.body.animeid}, '${req.session.username}');`
    console.log(query)
    try {
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    }catch (e) {

    }
}

const getFavorite = async (req, res) => {
    const query = `SELECT * FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl
                                       NATURAL JOIN animesynopsis NATURAL JOIN animereview 
         WHERE username = '${req.session.username}';`
    console.log(query)
    try {
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    }catch (e) {

    }
}


module.exports = {login, logout, deleteUser, register, showUser, addToFavorite, getFavorite}