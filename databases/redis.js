const redis = require('redis');
const {loggers} = require('winston');
const logger = loggers.get('general-logger');
const config = require("../config");

//Redist config for session management, we use Redis to handle sessions
let redisClient = redis.createClient({
    port: config.redisHeroku.port,
    host: config.redisHeroku.host
})
logger.info("redis client created");

redisClient.auth(config.redisHeroku.password, function(err){
    if(err){
        throw err;
    }
    console.log("redis client authenticated");
});

module.exports = redisClient;