import {userRepo} from '@module/user/repo/user.repo';
import * as metaUtil from '@metamask/eth-sig-util'
import * as jwt from 'jsonwebtoken';
const Web3 = require('web3');


export class UserService {

    public async getUser(query: any): Promise<any> {
        try {
            return userRepo.findUser(query)
        } catch (error) {
            throw (error);
        }
    }

    public async createUser(publicAddress: string): Promise<any> {
        try {
            return userRepo.signUp({publicAddress})
        } catch (error) {
            throw (error);
        }
    }

    public async authenticate(dataObj: any): Promise<any> {
        try {
            const userObj: any = await userRepo.findUser({publicAddress: dataObj.publicAddress});
            console.log(userObj, 'userObj');
            if (Object.entries(userObj).length === 0) {
                throw new Error('User not exists');
            }
            const msg = `I am signing my one-time nonce: ${userObj.nonce}`;
            const msgBufferHex = Web3.utils.sha3(msg);
            const address = metaUtil.recoverPersonalSignature({
                data: msgBufferHex,
                signature: dataObj.signature
            });
            if (address.toLowerCase() === dataObj.publicAddress.toLowerCase()) {
                let token: string = await UserService.generateJWT(userObj);
                return ({
                    token,
                    _id: userObj._id
                });
            } else {
                throw new Error('Signature verification failed');
            }
        } catch (error) {
            throw (error);
        }
    }

    private static async generateJWT(userObject: any) {
        try {
            let payLoad = {
                userId: userObject._id,

            };
            const options = {expiresIn: '30d', issuer: process.env.APP_JWT_ISSUER};
            const secret = process.env.APP_JWT_SECRET;
            const token = jwt.sign(payLoad, secret, options);

            return (token);
        } catch (error) {
            throw (error);
        }
    }
}

export const userService: UserService = new UserService();
