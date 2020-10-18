var configValues = require("./config");

module.exports =  {
    atlasMongo: {
        connectionString: process.env.ATLAS_MONGODB_CONNECTION_URI? process.env.ATLAS_MONGODB_CONNECTION_RUI: configValues.atlasMongo.connectionString
    },
    localMongo: {
        TestDbConnectionString: process.env.MONGO_TEST_CONNECTIONSTRING? process.env.MONGO_TEST_CONNECTIONSTRING: configValues.localMongo.TestDbConnectionString
    },
    redisHeroku: {
        port: process.env.REDISHEROKU_PORT? process.env.REDISHEROKU_PORT: configValues.redisHeroku.port,
        host: process.env.REDISHEROKU_HOST? process.env.REDISHEROKU_HOST: configValues.redisHeroku.host,
        password: process.env.REDISHEROKU_PASSWORD? process.env.REDISHEROKU_PASSWORD: configValues.redisHeroku.password,
        connectionString: process.env.REDISHEROKU_CONNECTION_URI? process.env.REDISHEROKU_CONNECTION_URI: configValues.redisHeroku.connectionString
    },
    facebookApi: {
        FACEBOOK_APP_ID: process.env.FACEBOOK_API_ID?process.env.FACEBOOK_API_ID: configValues.facebookApi.FACEBOOK_APP_ID,
        FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET?process.env.FACEBOOK_APP_SECRET: configValues.facebookApi.FACEBOOK_APP_SECRET
    },
    server:{
        port: process.env.PORT?process.env.PORT :5000
    }
}
