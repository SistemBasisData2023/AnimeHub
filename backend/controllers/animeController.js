const {db} = require("../database/connectDB");
const {end, send} = require("express/lib/response");
const {json} = require("express");

const getAllAnime = async (req, res) =>{
    try{
        const query = 'SELECT * FROM anime'
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    }catch(err){
        console.log(err)
        res.status(500).json({err: 'Failed to get anime list'})
    }

};

const getDetailed = async (req, res) => {
    try{
        const query = `SELECT *, ROW_NUMBER () OVER (
            ORDER BY score DESC
            ) AS rank FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl
         NATURAL JOIN animesynopsis;`
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    }catch(err){
        console.log(err)
        res.status(500).json({err: 'Failed to get detailed anime list'})
    }
};

const getTopAnime = async (req, res) => {
    try{
        const query = `SELECT  ROW_NUMBER () OVER (
            ORDER BY score DESC) 
            AS rank, anime.animeid, title,img_url, score
                   FROM anime NATURAL JOIN animedetail NATURAL JOIN
                        animeurl WHERE members >= 10
                   OFFSET (${req.body.page} * 20) LIMIT 20;`
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    }catch (e) {
        res.status(500).json({e: 'Failed to get top anime list'})

    }
};

const searchAnime = async (req, res) => {
    try {
        const query = `SELECT animeid, title, genre, img_url
                       FROM anime
                                NATURAL JOIN animedetail
                                NATURAL JOIN animeurl
                       WHERE title ILIKE '${req.body.title}%';`;
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    } catch (e) {
        res.status(500).json({e: 'Anime not found'})
    }
};

const addReview = async (req, res) => {
    let score;
    let member;
    let animeid = req.body.animeid
    try {
        let query = `INSERT INTO animereview values (${req.body.score}, '${req.body.review}', ` + animeid + `);`;
        console.log(query)
        let results = await db.query(query);
        query = `SELECT *
                 FROM animedetail
                 WHERE animeid = ` + animeid;
        results = await db.query(query);
        console.log(query)
        score = (results.rows[0].score * results.rows[0].members + req.body.score) / (results.rows[0].members + 1)
        member = results.rows[0].members + 1
        query = `UPDATE animedetail
                 SET score = ` + score + `, members = ` + member +
            ` WHERE animeid = ` + animeid + ` ;`
        console.log(query)
        results = await db.query(query);
        res.send('Review added');
    } catch (e) {
        res.status(500).json({e: 'Anime not found'})
    }
}

const addAnime = async (req, res) => {
    try{
        const query = `WITH insertAnime AS (
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
        const result = await db.query(query);
        const list = result.rows;
        res.send('Anime added')
    }catch (e) {

    }
}

const deleteAnime = async (req, res) => {
    try{
        const query = `WITH deleteAnime AS (
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
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).strings('Anime deleted');
    }catch (e) {

    }
}
module.exports = {getAllAnime, getDetailed, getTopAnime, searchAnime, addReview, addAnime, deleteAnime};
