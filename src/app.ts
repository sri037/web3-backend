import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as hbs from 'express-hbs';
import * as dotEnv from 'dotenv';

require('module-alias/register');

const {logger, errorLog} = require('@utils/logger');


class App {

    public express: any;

    constructor() {
        dotEnv.config({path: './src/environment/env-config.env'});
        this.express = express();
        this._initializeMiddleware();
        App._connectToDB().then(r => logger.info('Connection Established ' + 'to mongo'));
        this._mountRoutes();
    }

    private static async _connectToDB() {
        try {
            await App._connectDB();
        } catch (error) {
            errorLog.error(error);
        }
    }

    private _mountRoutes(): void {
        this.express.get('/', (req: any, res: any): any => {
            res.send({
                message: 'Server is up & running'
            });
        });
    }

    private _initializeMiddleware() {
        this.express.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', process.env.APP_ALLOWED_ORIGIN);
            res.setHeader('Access-Control-Allow-Headers', process.env.APP_ALLOWED_HEADERS);
            res.setHeader('Access-Control-Allow-Methods', process.env.APP_ALLOW_METHODS);
            next();
        });

        // parse application/x-www-form-urlencoded
        this.express.use(bodyParser.urlencoded({extended: false}));

        this.express.use(bodyParser.json({limit: process.env.APP_MAX_FILE_SIZE}));

        // Adding a view engine, render html
        this.express.engine('server.view.html', hbs.express4({
            extname: '.server.view.html'
        }));

        this.express.set('view engine', 'server.view.html');
        this.express.set('views', path.resolve('./'));
        this.express.use(express.static('public/www'));
        this.express.use('/public', express.static(path.resolve(__dirname, '../public')));
    }

    private static async _connectDB(): Promise<any> {
        const connection = await import('./utils/db/mongoose');
        const noSQLClient = new connection.default();
        try {
            return await noSQLClient.connect();
        } catch (e) {
            errorLog.error(e);
        }
    }
}

export default new App().express;
