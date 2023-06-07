//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
 
//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client, DatabaseError } = require('pg');
const bcrypt = require('bcrypt');
const { prototype } = require('express-session/session/cookie');
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = new Client({
    host    : 'ep-still-block-012056.ap-southeast-1.aws.neon.tech',
    database: 'AnimeHub',
    user    : 'muhammad.farrel13',
    password: 'hqQ12NUmsXnb',
    port    : 5432,
    sslmode :'require',
    ssl     : true
});

db.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log("Database is Connected Successfully")
})

app.use(
    session({
        secret: 'ini contoh secret',
        saveUninitialized: false,
        resave: false
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

var temp;

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = `SELECT * FROM users WHERE email='${email}'`;

    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.rows.length > 0) {
        bcrypt.compare(password, result.rows[0].password, (err, compareResult) => {
          if (compareResult === true) {
            req.session.email = email;
            res.send("Login Successful");
          } else {
            res.send("Login Failed");
          }
        });
      } else {
        res.send("Login Failed");
      }
    });
});

app.post('/register', (req, res) =>{
    temp = req.session;
    temp.email = req.body.email;
    temp.username = req.body.username;
    temp.password = req.body.password;
    const hash = bcrypt.hashSync(temp.password, 10);
    const query = `INSERT INTO users(email, username, password) VALUES ('${temp.email}', '${temp.username}', '${hash}')`;
    db.query(query, (err, results) => {
        // tambahkan konfigurasi registrasi di sini
        if(err){
            console.log(err);
            res.send('error');
        }
    });
    res.end('done');
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.end('error')
            return 
        }
        res.end('logout')
    });
});

app.post('/showUser', (req, res) => {
    const query = `SELECT * FROM users;`
    db.query(query, (err, results) => {
        if(err){
            console.log(err)
            res.end('error')
            return
        }
    })
});

app.get("/getdata", (req, res) => {
    const query = "SELECT * FROM users"; // query ambil data
    //mendapatkan data dari database
    db.query(query, (err, results) => {
      //tambahkan konfigurasi disini
      if (err) {
        return res.json({
          status: false,
          message: "Internal server Error",
        });
      } else {
        return res.json({
          status: true,
          message: "Data Posted",
          data: results.rows,
        });
      }
    });
});

app.post("/deleteUser", (req, res) => {
    temp = req.session;
    temp.id = req.body.id
    if(temp.user_id.length > 0){
        db.query(`DELETE FROM users WHERE id = ${temp.id};`, (err) => {
            if (err) {
                console.log(err);
                res.end('fail');
                return;
            }
            else{
                res.end('done');
            }
        });
    }
    else{
        res.end('empty')
    }
});

app.listen(3001,()=>{
    console.log("Port 3001 berhasil terkoneksi !")
})

