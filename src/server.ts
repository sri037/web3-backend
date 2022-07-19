import app from './app';
import errorHandler from './utils/exception/error-handler';
import {api} from './io/api';
import * as path from 'path';

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const {logger, errorLog} = require('./utils/logger');


const port = process.env.APP_PORT;
console.log(port, 'port');

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50 // limit each IP to 50 requests per windowMs
});

app.use(limiter);

app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

app.use(mongoSanitize({
    replaceWith: '_'
}));

app.use('/api', api);

app.all('/*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.join(__dirname, '../public/www/', 'index.html'));
});

// Error handler middleware
app.use(errorHandler);

app.listen(port, () => {
    logger.info('Server is listening on Port:' + port);
});
