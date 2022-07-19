const log4js = require('log4js');
log4js.configure({
    appenders: {
        fileAppender: {type: 'dateFile', filename: './logs/error.log', pattern: '.yyyy-MM-dd', compress: false},
        console: {type: 'console'}
    },
    categories: {
        default: {appenders: ['console'], level: 'info'},
        logToFile: {appenders: ['fileAppender', 'console'], level: 'error'}
    }
});

const logger = log4js.getLogger();
const errorLog = log4js.getLogger('logToFile');
module.exports = {
    logger,
    errorLog
};
