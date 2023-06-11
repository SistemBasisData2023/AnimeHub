const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

//user login
router.post("/login", accountController.login);
//user register
router.post("/register", accountController.register);
//user logout
router.post("/logout", accountController.logout);
//show all user
router.get("/showUser", accountController.showUser);
//delete user
router.delete("/deleteUser", accountController.deleteUser);
//add anime to user's favorite list
router.post("/addFavorite", accountController.addToFavorite);
//get user's favorite anime list
router.get("/getFavorite", accountController.getFavorite);
//check current session
router.get("/check-session", accountController.checkSession);
//remove anime from user's favorite list
router.post("/removeFromFavorite", accountController.removeFromFavorite);
module.exports = router;