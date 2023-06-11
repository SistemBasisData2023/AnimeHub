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
            ) AS rank,  ROUND(score::numeric, 2) AS roundedScore FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl
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
    console.log(req.body.page);
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
        const query = `SELECT *
                       FROM anime
                                NATURAL JOIN animedetail
                                NATURAL JOIN animeurl
                                NATURAL JOIN animesynopsis
                       WHERE title ILIKE '${req.body.title}%';`;
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    } catch (e) {
        res.status(500).json({e: 'Anime not found'})
    }
};

const getAnimeById = async (req, res) => {
    try{
        const query = `SELECT * FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl
         NATURAL JOIN animesynopsis WHERE animeid = ${req.body.animeid};`;
        const result = await db.query(query);
        res.status(200).json(result.rows)
    }catch (e) {
        res.status(500).json({e})
    }
}
const addReview = async (req, res) => {
    if (!req.session.username) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    const animeid = req.body.animeid;
    const newScore = parseFloat(req.body.score);
  
    try {
      // Check if the user has already reviewed the anime
      const reviewQuery = `SELECT * FROM animereview WHERE animeid = $1 AND username = $2`;
      const existingReview = await db.query(reviewQuery, [animeid, req.session.username]);
      if (existingReview.rows.length > 0) {
        res.status(400).json({ error: 'You have already submitted a review for this anime' });
        return;
      }
  
      // Insert the new review
      const insertQuery = `INSERT INTO animereview (score, review, animeid, username) VALUES ($1, $2, $3, $4)`;
      await db.query(insertQuery, [req.body.score, req.body.review, animeid, req.session.username]);
  
      // Update the anime's score and member count
      const updateQuery = `UPDATE animedetail SET score = ((score * members) + $1) / (members + 1), members = members + 1 WHERE animeid = $2`;
      await db.query(updateQuery, [newScore, animeid]);
  
      res.status(200).json({ success: true, message: 'Review added' });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  

const getReview = async (req, res) => {
    const query = `SELECT * FROM animereview NATURAL JOIN anime WHERE animeid = $1;`
    const values = [req.params.animeid];

    try {
        const result = await db.query(query, values);
        const list = result.rows;
        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Review not found'});
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

const getPaginatedAnime = async (req, res) => {
    const limit = 20; // number of records per page
    let offset = 0; // start from the first record

    if (req.body.page) {
        offset = req.body.page * limit; // calculate the offset
    }

    const query = `SELECT *, ROW_NUMBER () OVER (
            ORDER BY score DESC
            ) AS rank FROM anime NATURAL JOIN animedetail NATURAL JOIN animeurl
         NATURAL JOIN animesynopsis
         OFFSET ${offset} LIMIT ${limit};`

    try {
        const result = await db.query(query);
        const list = result.rows;
        res.status(200).json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Failed to get anime list'});
    }
};

module.exports = {getAllAnime, getDetailed, getTopAnime, searchAnime, addReview, addAnime,
    deleteAnime, getAnimeById, getPaginatedAnime, getReview};
