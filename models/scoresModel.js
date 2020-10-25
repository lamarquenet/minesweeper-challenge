const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userScoreSchema = new Schema({
    email: {type: String, unique: true, required:true},
    name: {type: String, required: true},
    bestTime: {type: Number, unique: true, required:true}
});

const ScoresSchema = new Schema({
    bestTimeNormal: [userScoreSchema],
    bestTimeHard: [userScoreSchema],
    bestTimeNightmare: [userScoreSchema]
});

const Scores = mongoose.model("Scores", ScoresSchema);

module.exports = Scores;