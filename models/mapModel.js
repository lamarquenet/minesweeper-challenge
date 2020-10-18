const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const areaSchema = new Schema({
    posY: {type: Number, required: true},
    posX: {type: Number, required: true},
    isBomb: {type: Boolean, required: true},
    isRevealed: {type: Boolean, default:false},
    isFlagged: {type: Boolean, default:false},
});
const minePositions = new Schema({
    posY: {type: Number, required: true},
    posX: {type: Number, required: true}
});

//todo add reference to the user that created the match so i can list all his games when he logs in
const mapSchema = new Schema({
    rows: {type: Number, required: true},
    columns: {type: Number, required: true},
    mines: {type: Number, required: true},
    minePositions: [minePositions],
    board: [areaSchema]
});
const AreaModel = mongoose.model("Area", areaSchema);
const MapModel = mongoose.model("Map", mapSchema);

module.exports = {
    MapModel,
    AreaModel
};