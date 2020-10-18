var cors = require('cors')

var whitelist = ['http://localhost:5000', 'https://localhost:5000']
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

module.exports = cors(corsOptions);