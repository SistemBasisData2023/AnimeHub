const express = require('express');
const router = express.Router();

const animeController = require('../controllers/animeController');

//Get basic data from all anime
router.get("/getAllAnime", animeController.getAllAnime);
//Get data from all anime related table
router.get("/getDetailed", animeController.getDetailed);
//Search by title
router.post("/searchAnime", animeController.searchAnime);
//add new anime's review
router.post("/addReview", animeController.addReview);
//add new anime
router.post("/addAnime", animeController.addAnime);
//delete registered anime
router.post("/deleteAnime", animeController.deleteAnime);
//find anime by animeid
router.post("/getAnimeById", animeController.getAnimeById);
//get anime data in paginated format
router.post("/getPaginatedAnime", animeController.getPaginatedAnime);
//get review by animeid
router.get("/getReviewById/:animeid", animeController.getReview);
//get anime by genre
router.post("/getByGenre", animeController.getByGenre);
module.exports = router;
