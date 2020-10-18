//require the service to be programmed

/* GET home page. */
const home = (req, res) =>{
    res.render('welcome', { title: 'Express' });
};

const dashboard = (req, res) =>{
    res.render('dashboard', {
        name: req.user.name
    })
}

const newGame = (req, res) => {
    const {height, width, mines} = req.body;
    //call gameservice to handle logic
};

const getGame = async(req, res) => {
    const {gameId} = req.params;
    //call gameservice to handle async logic
};

const updateCell = (req, res)=> {
    const {row, column, action, gameId} = req.body;
    //call gameservice to handle logic
};

module.exports = {
    home,
    dashboard,
    newGame,
    getGame,
    updateCell
};