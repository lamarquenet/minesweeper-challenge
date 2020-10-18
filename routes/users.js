const express = require('express');
const router = express.Router();
const userServices = require('../controller/usersController');
const {ifAuthRedirectToDash} = require('../middlewares/auth');

//Login Page
router.get('/login',ifAuthRedirectToDash, (req , res) => {res.render('login')});

//Register Page
router.get('/register',ifAuthRedirectToDash, (req , res) => res.render('register'));

router.get('/loginFacebook',ifAuthRedirectToDash, userServices.loginFacebook);

//here is where facebook redirect the user after authenticating
router.get('/loginFacebook/callback', userServices.loginFacebookCb)

//logout handle
router.get('/logout', userServices.logout);

//post request
//authenticate user using passport local strategy and Flash session message, we need to use next as param
router.post('/login', userServices.loginLocal);

// Register Handle
router.post('/register', userServices.register);

module.exports = router;