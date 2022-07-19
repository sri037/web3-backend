import {NextFunction} from 'express';
import {userService} from '@module/user/services/user.service';

export class UserAuthController {

    constructor() {
    }

    public async signIn(req: any, res: any, next: NextFunction): Promise<any> {
        try {
            let dataObj: any = req.body.data;
            let userObj = await userService.getUser({publicAddress: dataObj});

            res.send({
                data: {
                    userObj: userObj
                }
            });
        } catch (e) {
            next(e)
        }
    }

    public async signUp(req: any, res: any, next: NextFunction): Promise<any> {
        try {
            let dataObj: any = req.body.data;
            let userObj = await userService.createUser(dataObj);

            res.send({
                data: {
                    userObj: userObj
                }
            });
        } catch (e) {
            next(e)
        }
    }

    public async authenticate(req: any, res: any, next: NextFunction): Promise<any> {
        try {
            let dataObj: any = req.body.data;
            let userObj = await userService.authenticate(dataObj);
            res.send({
                data: {
                    userObj: userObj
                }
            });
        } catch (e) {
            next(e);
        }
    }
}

export const userAuthController: UserAuthController = new UserAuthController();
