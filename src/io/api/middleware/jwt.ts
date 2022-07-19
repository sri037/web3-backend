import * as jsonToken from 'jsonwebtoken';
import {UserDocument} from '@module/user/model/user.type';
import {Express, NextFunction} from 'express';
import {StatusCodes} from '@helpers/status.codes';
import {userService} from '@module/user/services/user.service';

export class JWT {
    constructor() {
    }

    /**
     * @function, a middleware to authenticate JWT
     * @param {Express.Request} req -> Express request object, fetch profile object from req.body.data JSON payload.
     * @param {Express.Response} res -> Express response object, send a response
     * @param {NextFunction} next -> Express callback to handle error
     * @returns, on success -> control is passed to next function.
     **/
    public async authenticateUser(req: any, res: any, next: any): Promise<any> {
        const errorObj = {
            code: StatusCodes.INVALID_JWT_TOKEN,
            status: StatusCodes.FORBIDDEN_CODE
        };
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                next(errorObj);
            }
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: process.env.APP_JWT_EXPIRY || '90d',
                issuer: process.env.APP_JWT_ISSUER
            };
            let result = jsonToken.verify(token, process.env.APP_JWT_SECRET, options);
            let userObj: UserDocument = await userService.getUser({_id: result.userId});
            if (!userObj) {
                next(errorObj);
            } else {
                req.user = userObj;
                next();
            }

        } catch (error) {
            next(errorObj);
        }
    }
}

export const jwt: JWT = new JWT();
