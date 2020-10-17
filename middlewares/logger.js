const { format, loggers, transports } = require('winston');
let logger = null;

const configureWinstonLogger = () =>{

    logger = loggers.add('general-logger', {
        transports: [
            new transports.File({
                level: 'debug',
                filename: './log/logsCombined.log',
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            }),
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple()
                ),
                level: process.env.NODE_ENV === 'production'?'info':'verbose',
                handleExceptions: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    })
    logger.stream={
        write: function (message, encoding) {
            //eliminate color code comming from morgan to grab only colors from winston in console and not in file
            logger.info(message.slice(0, -1).replace(/\u001b\[[0-9]{1,2}m/g, ''));
        }
    }
}

const useWinstonCombinedWithMorgan = (app)=>{
    configureWinstonLogger()
    //add morgan logger combined with winston logger so both writes to the same stream, morgan is a middleware
    const logger = loggers.get('general-logger')
    if (process.env.NODE_ENV === 'production') {
        const morgan = require("morgan");
        app.use(morgan("combined", { "stream": logger.stream }));
    }
    else{
        const morgan = require("morgan");
        app.use(morgan("dev", { "stream": logger.stream}));
    }

    return logger;
}

module.exports = {
    configureWinstonLogger,
    useWinstonCombinedWithMorgan
};