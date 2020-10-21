var cors = require('cors')
var config = require('../config');

var whitelist = ['https://buscamina.herokuapp.com:443', 'https://buscamina.herokuapp.com', 'https://buscamina.herokuapp.com:'+config.server.port, 'http://localhost:5000', 'https://localhost:5000']
var corsOptions = {
    origin: function (origin, callback) {
        console.log(whitelist.indexOf(origin) !== -1)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

module.exports = cors(corsOptions);