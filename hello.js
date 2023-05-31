//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')

//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const { isWindows } = require('nodemon/lib/utils');
const { write } = require('fs');

const db = new Client({
    //isi dengan konfigurasi database anda
    user: 'postgres',
    host: 'localhost',
    database: 'animehub',
    password: 'tes123',
    port: 5432
});

db.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('Database berhasil terkoneksi')
})

app.get('/getAllAnime', (req,res) =>{
    temp = req.session
    const query = 'SELECT * FROM anime'
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })
})

app.get('/getDetailed', (req,res) =>{
    temp = req.session
    const query = 'SELECT * FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl;'
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })
})

app.get('/getSynopsis', (req,res) =>{
    temp = req.session
    const query = 'SELECT * FROM animesynopsis;'
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })
})

app.get('/getTopAnime', (req,res) =>{
    temp = req.session
    const query = 'SELECT anime.animeid, title, ranked, img_url FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl' +
        ' WHERE ranked > 0 ORDER BY ranked LIMIT 50;'
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })
})

app.post('/searchAnime', (req, res) =>{
    temp = req.session;
    temp.title = req.body.title;
    const query = `SELECT animeid, title, img_url FROM anime NATURAL JOIN animedetail 
    NATURAL JOIN animeurl WHERE title LIKE '$(temp.title)';`;
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })
})

app.listen(process.env.PORT || 5500, () => {
    console.log(`App Started on PORT ${process.env.PORT || 5500}`);
});
