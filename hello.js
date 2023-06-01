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
    user: 'laode.alif',
    host: 'ep-wild-shadow-492151.ap-southeast-1.aws.neon.tech',
    database: 'animehub',
    password: 'Fm8Wq6ITNhkH',
    port: 5432,
    sslmode: 'require',
    ssl: true
});

db.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('Database berhasil terkoneksi')
})

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
const corsOptions = {
    origin: '*',
    Credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')));
var temp;

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
    const query = 'SELECT * FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl' +
        ' NATURAL JOIN animesynopsis;'
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

app.post('/getTopAnime', (req,res) =>{
    const query = `SELECT  ranked, anime.animeid, title,img_url FROM anime NATURAL JOIN animedetail NATURAL JOIN
    animeurl WHERE ranked > (${req.body.page} * 50) ORDER BY ranked LIMIT 50;`
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
    const query = `SELECT animeid, title, genre, img_url FROM anime NATURAL JOIN animedetail 
    NATURAL JOIN animeurl WHERE title LIKE '${req.body.title}%';`;
    console.log(query);
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })
})

app.post('/insertComment', (req, res) => {
    db.query(`INSERT INTO comment VALUES ('${req.body.animeid}', '${req.body.uid}', '${req.body.comment}');`, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send('Comment successfully added')
    })
})

app.post('/addAnime', (req, res) => {
    let query = `WITH insertAnime AS (
                 INSERT INTO anime (uid, title, genre)
                 VALUES (${req.body.uid}, '${req.body.title}', '${req.body.genre}')
                     ),
                     insertDetail AS (
                 INSERT INTO animedetail
                     (aired, episodes, members, popularity, ranked, score)
                 VALUES ('${req.body.aired}', ${req.body.episodes}, ${req.body.members}, 0, 0, 0)
                     ), 
                     insertSynopsis AS(
                     INSERT INTO animesynopsis(synopsis) 
                         VALUES ('${req.body.synopsis}')
                     )
                 INSERT INTO animeurl( img_url, url_link)
                 VALUES
                     ( '${req.body.img_url}', '${req.body.url_link}');`
    res.send(query)
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send(results.rows)
    })

})

app.post('/deleteAnime', (req, res) => {
    let query = `WITH deleteAnime AS (
                 DELETE FROM anime WHERE animeid = ${req.body.animeid}
                     ),
                     deleteDetail AS (
                 DELETE FROM animedetail WHERE animeid = ${req.body.animeid} 
                     ), 
                     deleteSynopsis AS(
                     DELETE FROM animesynopsis WHERE animeid = ${req.body.animeid}
                     )
                 DELETE FROM animeurl
                 WHERE animeid = ${req.body.animeid};`
    res.send(query)
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
