const express = require('express');
const router = express.Router();
const {ifAuthRedirectToDash , ensureAuth} = require('../middlewares/auth');
const controllers = require("../controller/indexController")

//welcome Page
router.get('/', ifAuthRedirectToDash, controllers.home);
//can only access this route if the user is authenticated
router.get('/dashboard', ensureAuth ,controllers.dashboard);
//create game and return game id
router.post('/newGame', ensureAuth, controllers.newGame);
//one user select a game returns game info
router.get('/games/:gameId', ensureAuth, controllers.getGame);
//update cell when user click a cell
router.put('/updateCell', ensureAuth, controllers.updateCell);

module.exports = router;
