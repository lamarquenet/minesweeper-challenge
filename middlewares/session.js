const session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
const redisClient = require('../databases/redis');

const sessionInstance = session({
    store: new RedisStore({ client: redisClient }), //hook the session manager with the redis client db
    secret: 'secretwordgenerator',
    saveUninitialized: false,
    resave: false, //don't overwrite session if nothing was changed
    name: 'sessionId',
    cookie: {
        secure: false, //todo change to true for production
        httpOnly: true, //prevent client side js from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 * 30, //define in ms how long is the cookie valid, 30 days here
    }
})

module.exports = sessionInstance;