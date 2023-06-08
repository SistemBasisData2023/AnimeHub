

/*//import packages
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
    const query = `SELECT *, ROW_NUMBER () OVER (
            ORDER BY score DESC
            ) AS rank FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl
         NATURAL JOIN animesynopsis;`
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
    const query = `SELECT  ROW_NUMBER () OVER (
            ORDER BY score DESC
            ) AS rank, anime.animeid, title,img_url, score
                   FROM anime NATURAL JOIN animedetail NATURAL JOIN
                        animeurl WHERE members >= 10
                   OFFSET (${req.body.page} * 50) LIMIT 50;
    `
    console.log(query)
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
    NATURAL JOIN animeurl WHERE title ILIKE '${req.body.title}%';`;
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
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send('New anime added')
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
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        res.send('Anime deleted')
    })
})

app.post('/addReview', (req, res) => {
    let animeid = req.body.animeid
    let score = 0
    let member = 0
    let query = `INSERT INTO animereview values (${req.body.score}, '${req.body.review}', ` + animeid + `);`
    console.log(query)
    db.query(query, (err, results) =>{
        if(err){
            console.log(err)
            res.end('error')
            return
        }
    })
    query = `SELECT * FROM animedetail WHERE animeid = ` + animeid
    db.query(query, (err, results) => {
        if(err){
            console.log(err)
            res.end('error')
            return
        }
        score = (results.rows[0].score * results.rows[0].members + req.body.score) / (results.rows[0].members + 1)
        member = results.rows[0].members + 1
        query = `UPDATE animedetail SET 
                       score = ` + score + `, members = ` + member +
            ` WHERE animeid = ` + animeid + ` ;`
        db.query(query, (err, results) => {
            if(err){
                console.log(err)
                res.end('error')
                return
            }
        })
        console.log(query)
    })

    res.send('Review added')
})
*/
/*
app.listen(process.env.PORT || 5500, () => {
    console.log(`App Started on PORT ${process.env.PORT || 5500}`);
});
*/