const gameServices = require("../services/gameServices");

const dashboard = async(req, res) =>{
    let game = undefined;
    const scores = await gameServices.getScores();
    if(req.user.gameId){
        game = await gameServices.getGame(req.user.gameId);
    }
    res.render('dashboard', {
        name: req.user.name,
        game: game,
        scores: scores
    })
}

const newGame = async(req, res) => {
    const {height, width, mines} = req.body;
    if(req.user.gameId){
        await gameServices.deleteGame(req.user.gameId);
    }
    gameServices.createGame(height, width, mines, req.user.name, req.user.email)
        .then(async(game) => {
            req.user.gameId = game._doc._id.toString();
            gameServices.updateUserWithGameId(req.user)
                .then(result => res.json({
                    serverDate: game._doc.time.getTime()
                }))
                .catch(async (err) => {
                    //if we reach this point something failed while trying to add this game id to the user
                    //delete the game so we don't have orphan games populating the db.
                    await gameServices.deleteGame(req.user.gameId);
                    req.user.gameId =null;
                    res.status(500).json({error: err})
                })

        })
        .catch(err => res.status(400).json({error:"Error creating your game"}))
};

const getGame = async(req, res) => {
    const {gameId} = req.params;
    gameServices.getGame(gameId)
        .then(game => res.json(game))
        .catch(err =>{
            console.error(err)
            res.status(400).json({error:"Error while getting your game"})
        })
};

const updateCell = (req, res)=> {
    const {posY, posX, action} = req.body;
    gameServices.updateSquare(posX, posY, action, req.user.gameId)
        .then(result =>{
            res.json(result)
        })
        .catch(err => {
            res.json(err)
        })
};


module.exports = {
    dashboard,
    newGame,
    getGame,
    updateCell
};