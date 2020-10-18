const express = require('express');
const router = express.Router();
const {ifAuthRedirectToDash , ensureAuth} = require('../middlewares/auth');
const controllers = require("../controller/gameController")
const {validateNewGameReqBody , validateGameIdReqBody, validateBoxUpdateParamsAndBody} = require("../middlewares/joiValidation");
router.use(ensureAuth);

//can only access this route if the user is authenticated
router.get('/list', controllers.dashboard);
//create game and return game id
router.post('/newGame',validateNewGameReqBody, controllers.newGame);
//one user select a game returns game info
router.get('/:gameId',validateGameIdReqBody, controllers.getGame);
//update cell when user click a cell
router.put('/updateCell',validateBoxUpdateParamsAndBody, controllers.updateCell);

module.exports = router;