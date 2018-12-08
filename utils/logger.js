const winston = require('winston')
const config = require('../config')

/*
    trasportes disponible:
        https://github.com

    Niveles de logs:
    0: error
    1: warn
    2: info
    3: verbose
    4: debug
    5: silly
*/

var options = {
    file: {
        level: 'info',
        filename: `${__dirname}/../logs/logs-de-aplicacion.log`,
        handleExceptions: true,
        json: true,
        
        maxsize: 5242880, // 5 MB
        maxFiles: 5,
        colorize: false,
        
        prettyPrint: object => {
            return JSON.stringify(object)
        }
    },
    console: {
        level: config.suprimirLogs ? 'error' : 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        prettyPrint: object => {
            return JSON.stringify(object)
        }
    },
  };

module.exports = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
})