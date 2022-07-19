import { NextFunction, Request, Response } from 'express';
import ExceptionHandler from '@utils/exception/exception.handler';
const {errorLog} = require('@utils/logger');

function errorHandler(error: ExceptionHandler, request: Request, response: Response, next: NextFunction) {

    errorLog.error(error, 'errorHandler');

    const status = error.status || 500;
    const code = error.code || 'SOMETHING_WENT_WRONG';
    response
        .status(status)
        .json({
            code
        });
}
export default errorHandler;
