var configValues = require("./config");

module.exports =  {
    getDbConnectionStringAtlas: function(){
        return "mongodb+srv://"+configValues.atlasMongo.username+ ":"+configValues.atlasMongo.pwd +"@cluster0.mhtba.gcp.mongodb.net/passAuth?retryWrites=true&w=majority"
    },
    ...configValues
}