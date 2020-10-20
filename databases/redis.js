const redis = require('redis');
const {loggers} = require('winston');
const logger = loggers.get('general-logger');
const config = require("../config");
//Redist config for session management, we use Redis to handle sessions
let redisClient = redis.createClient(config.redis.connectionString);
logger.info("redis client created");

module.exports = redisClient;