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

app.post('/login', async (req, res) =>{
    temp = req.session;
    temp.email = req.body.email;
    temp.password = req.body.password;
    const query = `SELECT * FROM users WHERE email = '${temp.email}' AND password = '${temp.password}';`;
    if(temp.email.length > 0 && temp.password.length > 0){
        bcrypt.hash(temp.password, 10, function(err, hash) {
            if (err) {
                res.send(err);
            } 
            db.query(query, (err, results) => {
                if(results.rowCount < 1){
                    res.end('email')
                }
                else{
                    bcrypt.compare(temp.password, results.rows[0].password, (err, result) => {
                        if(!result){
                            res.end('Unsuccessful');
                            console.log(err);
                        }
                        res.end('Successful');
                    });
                }
            });
        });
    }
    else{
        res.end('empty');
    }
})

app.post('/register', (req, res) =>{
    temp = req.session;
    temp.name = req.body.email;
    temp.email = req.body.username;
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

app.listen(3001,()=>{
    console.log("Port 3001 berhasil terkoneksi !")
})
