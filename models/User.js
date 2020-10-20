const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    FBname: {type: String},
    FBtoken: {type: String},
    email: {type: String, unique: true, required: true},
    locallyRegistered: {type: Boolean, required: true},
    language: {type: String},
    password: {type: String, required: true},
    date: {type: String, unique: true, default: Date.now},
    gameId: {type: String, default: null}
});

const User = mongoose.model("User", userSchema);

module.exports = User;