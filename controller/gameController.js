const gameServices = require("../services/gameServices");

const dashboard = (req, res) =>{
    res.render('dashboard', {
        name: req.user.name
    })
}

const newGame = (req, res) => {
    const {height, width, mines} = req.body;
    gameServices.createGame(height, width, mines)
        .then(gameId => res.json({"id":gameId}))
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
    const {row, column, action, gameId} = req.body;
    gameServices.updateSquare(row, column, action, gameId)
        .then(result => res.json(result))
        .catch(err => res.json(err))
};

module.exports = {
    dashboard,
    newGame,
    getGame,
    updateCell
};