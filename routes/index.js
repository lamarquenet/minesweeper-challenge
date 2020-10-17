const express = require('express');
const router = express.Router();

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
