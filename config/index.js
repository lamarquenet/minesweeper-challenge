var configValues = require("./config");

module.exports =  {
    atlasMongo: {
        connectionString: process.env.ATLAS_MONGODB_CONNECTION_URI? process.env.ATLAS_MONGODB_CONNECTION_URI: configValues.atlasMongo.connectionString
    },
    localMongo: {
        TestDbConnectionString: process.env.MONGO_TEST_CONNECTIONSTRING? process.env.MONGO_TEST_CONNECTIONSTRING: configValues.localMongo.TestDbConnectionString
    },
    redis: {
       connectionString: process.env.REDIS_URL? process.env.REDIS_URL: configValues.redis.connectionString
    },
    facebookApi: {
        FACEBOOK_APP_ID: process.env.FACEBOOK_API_ID?process.env.FACEBOOK_API_ID: configValues.facebookApi.FACEBOOK_APP_ID,
        FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET?process.env.FACEBOOK_APP_SECRET: configValues.facebookApi.FACEBOOK_APP_SECRET
    },
    server:{
        port: process.env.PORT? process.env.PORT : configValues.server.port,
        url: process.env.URL? process.env.URL : configValues.server.url
    }
}
