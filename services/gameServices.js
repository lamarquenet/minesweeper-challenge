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
        map.unrevealedCells = width * height;
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

const setFinishTime = (gameId) =>{
    return new Promise(async (resolve, reject) => {
        MapModel.findOneAndUpdate({_id:gameId},{timeEnded: Date.now()})
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
}

const updateSquare = (posX, posY, action, gameId) =>{
    return new Promise(async (resolve, reject) => {
        const map = await MapModel.findById(gameId).catch(e => reject(e));
        if(map.gameOver){
            resolve({gameOver: "Your Game Is Over, you need to create a new one."})
        }
        else if(map.mines === map.unrevealedCells ){
            resolve({victory: "You won the game, please create a new game"})
        }
        else{
            const square = map._doc.board.filter(square => (square._doc.posY === posY && square._doc.posX === posX))[0]
            let cellsToUpdate = [];
            if(square.isRevealed){
                cellsToUpdate.push(square);
            }
            else if(action === "reveal"){
                openCell(square, map, cellsToUpdate)
            }
            else if(action === "red_flag"){
                square.isFlagged = true;
                square.isQuestioned = false;
                map.flags++;
                cellsToUpdate.push(square);
            }
            else if(action === "question_mark"){
                square.isFlagged = false;
                square.isQuestioned = true;
                map.flags--;
                cellsToUpdate.push(square);
            }
            else if(action === "clean"){
                square.isFlagged = false;
                square.isQuestioned = false;
                cellsToUpdate.push(square);
            }



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

const findAreaInBoard = (position, map) =>{
    return map._doc.board.filter(cell => (cell._doc.posY === position.posY && cell._doc.posX === position.posX))[0]
}

const openCell = async(cell, map , cellsToUpdate) =>{
    if(!cell.isRevealed){
        cell.isRevealed = true;
        map.unrevealedCells--;
        if(cell.isBomb){
            map.gameOver = true;
            await setFinishTime(map._id);
            //if we step into a mine, show all other mines
            map.minePositions.forEach(position => {
                const mineCell = findAreaInBoard(position,map);
                mineCell.isRevealed = true;
                mineCell.isFlagged = false;
                mineCell.isQuestioned = false;
                cellsToUpdate.push(mineCell);
            })
        }
        else if(map.mines === map.unrevealedCells){
            //if i won i need to stop the clock
            await setFinishTime(map._id);
        }
        else{
            if(cell.isFlagged){
                cell.isFlagged = false;
                cell.isQuestioned = false;
                map.flags--;
            }
            if(cell.nearMines === 0){
                openAdjacentNonMineCells(cell , map, cellsToUpdate);
            }
        }
        cellsToUpdate.push(cell);
    }
}
const getAdjacentCells = (cell , map) => {
    let adjacent = [],
        isTopRow    = cell.posY === 1 ? true : false,
        isBottomRow = cell.posY === (map.rows) ? true : false,
        isLeftEdge  = cell.posX === 1 ? true : false,
        isRightEdge = cell.posX === (map.columns) ? true : false;

    // Returns adjacent cells, checks if they are not out of bounds.
    if (!isTopRow){    adjacent.push({posX:cell.posX, posY:cell.posY - 1}) };
    if (!isLeftEdge){  adjacent.push({posX:cell.posX - 1, posY:cell.posY}) };
    if (!isRightEdge){ adjacent.push({posX:cell.posX + 1, posY:cell.posY}) };
    if (!isBottomRow){ adjacent.push({posX:cell.posX, posY:cell.posY + 1}) };

    if (!isTopRow && !isLeftEdge){      adjacent.push({posX:cell.posX - 1, posY:cell.posY - 1}) }
    if (!isTopRow && !isRightEdge){     adjacent.push({posX:cell.posX + 1, posY:cell.posY - 1}) }
    if (!isBottomRow && !isLeftEdge){   adjacent.push({posX:cell.posX - 1, posY:cell.posY + 1}) }
    if (!isBottomRow && !isRightEdge){  adjacent.push({posX:cell.posX + 1, posY:cell.posY + 1}) }

    adjacent = adjacent.map(position => findAreaInBoard(position, map))
    return adjacent;
}

// open adjacent cells that aren't yet shown and don't have a mine
const openAdjacentNonMineCells = (cell, map, cellsToUpdate )=> {
    let adjacentNonMineCells;


    adjacentNonMineCells = getAdjacentCells(cell, map).filter((cell)=> {
        return (!cell.isBomb && !cell.isRevealed);
    });

    if (adjacentNonMineCells.length > 0) {
        adjacentNonMineCells.forEach((adjacentCell) =>{
            openCell(adjacentCell , map , cellsToUpdate);
        });
    }
}

module.exports = {
    createGame,
    getGame,
    updateSquare,
    deleteGame,
    updateUserWithGameId,
    setFinishTime
};