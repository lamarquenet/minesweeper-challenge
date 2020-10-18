const express = require('express');
const router = express.Router();
const path = require("path");
const {ifAuthRedirectToDash , ensureAuth} = require('../middlewares/auth');

//welcome Page
router.get('/', ifAuthRedirectToDash, (req , res) => res.render('welcome'));
//can only access this route if the user is authenticated
router.get('/dashboard', ensureAuth ,(req, res) =>
    res.render('dashboard', {
        //when we are logged in passport middleware give us access to req.user
        name: req.user.name
    })
);

router.post('/newGame',(req, res) => {
    //logic to create the game
});

router.get('/games/:gameId',(req, res) => {
    //logic to get the game info
});

router.put('/updateCell',(req, res) => {
    //logic to update a Cell
});

module.exports = router;
