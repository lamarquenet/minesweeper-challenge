const mongoose = require('mongoose');
const config = require('../config');
const scoreModel = require("../models/scoresModel")
//DB Config
const mongooseAtlas = mongoose.connect(config.atlasMongo.connectionString,
    {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true , useCreateIndex: true})
    .then(() => {
        console.log('mongoDB connected...');
        scoreModel.find({})
            .then(found =>{
                //check if a scoreboard exist and if not proceed to create it
                if(found.length > 0){
                    console.log('scoreboard found...');
                }
                else{
                    console.log('scoreboard not found. Creating one with some data...')
                    let scoreboard = new scoreModel({
                        bestTimeNormal: [],
                        bestTimeHard: [],
                        bestTimeNightmare: []
                    });
                    scoreboard.save()
                        .then(() => console.log("scoreboard Created Sucessfully"))
                        .catch((err) => {throw new Error(err)})
                }
            })
            .catch((err) => {throw new Error(err)})
    })
    .catch(err => {throw new Error(err)});

module.exports = mongooseAtlas;