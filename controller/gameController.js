//require the service to be programme

const dashboard = (req, res) =>{
    res.render('dashboard', {
        name: req.user.name
    })
}

const newGame = (req, res) => {
    const {height, width, mines} = req.body;
    res.json({msg:"point reached"})
    //call gameservice to handle logic
};

const getGame = async(req, res) => {
    const {gameId} = req.params;
    res.json({msg:"point reached"})
    //call gameservice to handle async logic
};

const updateCell = (req, res)=> {
    const {row, column, action, gameId} = req.body;
    res.json({msg:"point reached"})
    //call gameservice to handle logic
};

module.exports = {
    dashboard,
    newGame,
    getGame,
    updateCell
};