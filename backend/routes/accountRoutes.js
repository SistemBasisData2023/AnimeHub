const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post("/login", accountController.login);
router.post("/register", accountController.register);
router.post("/logout", accountController.logout);
router.get("/showUser", accountController.showUser);
router.delete("/deleteUser", accountController.deleteUser);
router.post("/addFavorite", accountController.addToFavorite);
router.get("/getFavorite", accountController.getFavorite);
module.exports = router;