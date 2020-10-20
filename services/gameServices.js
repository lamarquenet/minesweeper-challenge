const {MapModel, AreaModel} = require("../models/mapModel");
const userModel = require("../models/User");

const createGame = (height, width, mines) =>{
    return new Promise(async (resolve, reject) => {
        let map = new MapModel({board: []});
        let minesPositions = [];
        for(let i=mines; i >0; i--){
            const minePosition = getBombPosition(height , width);
            minesPositions.push(minePosition);
        }
        for(let y = height; y > 0; y--){
            for(let x = width; x>0; x--){
                const isBomb = minesPositions.filter(mine => mine.posY === y && mine.posX === x).length > 0;
                const area = new AreaModel({
                    posY: y,
                    posX: x,
                    isBomb: isBomb
                })
                map.board.push(area);
            }
        }
        map.columns = width;
        map.rows = height;
        minesPositions.forEach(mine => {
            const adjacentCellsPlusMine = getAdjacentCellsPlusMine(mine.posX, mine.posY, map._doc);

            adjacentCellsPlusMine.forEach(cell => {
                cell.nearMines++;
            })
        })
        map.flags = 0;
        map.mines = mines;
        map.minePositions = minesPositions;
        const saved = await map.save();
        if(saved.errors){
            reject(saved.errors)
        }
        else{
            resolve(saved._doc._id.toString());
        }
    })
}

const getBombPosition = (height , width)=>{
    const randomY = getRandomInt(height);
    const randomX = getRandomInt(width);
    return {posY:randomY, posX:randomX};
}

const getRandomInt =(max) => {
    return Math.ceil((max) * Math.random());
}

const getAdjacentCellsPlusMine = (X, Y, map) =>{
    return map.board.filter(doc => {
        const cell = doc._doc;
        return (cell.posY >= Y - 1 && cell.posY <= Y + 1 && cell.posX >= X - 1 &&
            cell.posX <= X + 1 && cell.posX > 0 && cell.posX <= map.columns && cell.posY > 0 && cell.posY <= map.rows)
    })

}

const getGame = (gameId) =>{
    return new Promise(async (resolve, reject) => {
        MapModel.findById(gameId , '-_id -__v -minePositions._id -board._id')
            .lean()
            .then(map =>{
                if(map !== null){
                    //I avoid sending back to the user info about the mine locations, this should be keep only on the server
                    //unless we want to let the game logic responsibility to the client side to have a more responsive
                    //experience. But the user could easily cheat reading the response from the server to see where mines are located.
                    const filterInvisibleMines = map.board.map(cell => {
                        if(cell.isBomb && !cell.isRevealed){
                            cell.isBomb = false;
                        }
                        if(!cell.isRevealed){
                            cell.nearMines = 0;
                        }
                    })
                    resolve(map)
                }
                else{
                    resolve(null)
                }
            })
            .catch(e => reject(e))
    })
}

const deleteGame = (gameId) =>{
    return new Promise(async (resolve, reject) => {
        MapModel.deleteOne({"_id":gameId})
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
}

const updateUserWithGameId = (user) =>{
    return new Promise(async (resolve, reject) => {
        userModel.updateOne(user)
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
}

const updateSquare = (posX, posY, action, gameId) =>{
    return new Promise(async (resolve, reject) => {
        const map = await MapModel.findById(gameId).catch(e => reject(e));
        if(map.gameOver){
            resolve({gameOver: true})
        }
        else{
            const square = map._doc.board.filter(square => (square._doc.posY === posY && square._doc.posX === posX))[0]
            let cellsToUpdate = [];
            if(square.isRevealed){
                cellsToUpdate.push(square);
            }
            else if(action === "reveal"){
                square.isRevealed = true;
                if(square.isBomb){
                    map.gameOver = true;
                }
                else{
                    if(square.isFlagged){
                        square.isFlagged = false;
                        square.isQuestioned = false;
                        map.flags--;
                    }
                    //add logic to search the area and reveal all adjacent free spaces
                }
                cellsToUpdate.push(square);
            }
            else if(action === "red_flag"){
                square.isFlagged = true;
                square.isQuestioned = false;
                map.flags++;
                cellsToUpdate.push(square);
            }
            //todo add logic to mark the cell as questioned


            //todo logic to avoid user from keep playing once the game is over

            map.save()
                .then(res =>{
                    cellsToUpdate.forEach( cell => {
                        //dont tell the browser witch slots are bombs unless he reveals one
                        if(cell.isBomb && !cell.isRevealed){
                            cell.isBomb = false;
                        }
                    } )
                    resolve(cellsToUpdate)
                })
                .catch(err => reject(err))
        }
    })
}

module.exports = {
    createGame,
    getGame,
    updateSquare,
    deleteGame,
    updateUserWithGameId
};