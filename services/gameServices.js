const {MapModel, AreaModel} = require("../models/mapModel");

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
        map.mines = mines;
        map.columns = width;
        map.rows = height;
        map.minePositions = minesPositions;
        const saved = await map.save();
        resolve(saved._doc._id.toString());
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

const getGame = (gameId) =>{
    return new Promise(async (resolve, reject) => {
        MapModel.findById(gameId , '-_id -__v -minePositions._id -board._id')
            .lean()
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
}

const updateSquare = (row, column, action, gameId) =>{
    return new Promise(async (resolve, reject) => {
        const map = await MapModel.findById(gameId).catch(e => reject(e));
        const square = map._doc.board.filter(square => (square._doc.posY === row && square._doc.posX === column))[0]
        let response = {}
        if(square.isRevealed){
            response = {error:"This area is already revealed."}
        }
        else if(action === "reveal"){
            square.isRevealed = true;
            if(square.isBomb){
                response = {msg:"Kaboom, Game Over"}
            }
            else{
                response = {msg:"No bombs in this area"}
            }
        }
        else if(action === "red_flag"){
            square.isFlagged = true;
            response = {msg:"Area was successfully flagged"}
        }

        map.save()
            .then(res => resolve(response))
            .catch(err => reject(err))
    })
}

module.exports = {
    createGame,
    getGame,
    updateSquare
};