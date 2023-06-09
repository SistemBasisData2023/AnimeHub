const express = require('express');
const router = express.Router();

const animeController = require('../controllers/animeController');

router.get("/getAllAnime", animeController.getAllAnime);
router.get("/getDetailed", animeController.getDetailed);
router.post("/getTopAnime/:page", animeController.getTopAnime);
router.post("/searchAnime", animeController.searchAnime);
router.post("/addReview", animeController.addReview);
router.post("/addAnime", animeController.addAnime);
router.post("/deleteAnime", animeController.deleteAnime);
router.post("/getAnimeById", animeController.getAnimeById);
router.post("/getPaginatedAnime", animeController.getPaginatedAnime);

module.exports = router;
