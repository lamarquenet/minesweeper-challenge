const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const areaSchema = new Schema({
    posY: {type: Number, required: true},
    posX: {type: Number, required: true},
    isBomb: {type: Boolean, required: true},
    nearMines:{type: Number, default:0},
    isRevealed: {type: Boolean, default:false},
    isFlagged: {type: Boolean, default:false},
    isQuestioned: {type: Boolean, default:false}
});
const minePositions = new Schema({
    posY: {type: Number, required: true},
    posX: {type: Number, required: true}
});

const mapSchema = new Schema({
    creatorEmail: {type: String, required:true},
    creatorName: {type: String, required: true},
    gameOver: {type: Boolean, default:false},
    unrevealedCells: {type: Number, required:true},
    rows: {type: Number, required: true},
    columns: {type: Number, required: true},
    mines: {type: Number, required: true},
    flags: {type: Number, required: true},
    minePositions: [minePositions],
    board: [areaSchema],
    time: {type: Date, default:Date.now},
    timeEnded: {type: Date}
});
const AreaModel = mongoose.model("Area", areaSchema);
const MapModel = mongoose.model("Map", mapSchema);

module.exports = {
    MapModel,
    AreaModel
};