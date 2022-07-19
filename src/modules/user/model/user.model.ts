import {Schema, model, Model, Document} from 'mongoose';
import {Roles} from './user.type';

const bcrypt = require('bcrypt');
const validator = require('validator');
const saltRounds = parseInt(process.env.APP_SALT_ROUNDS);

/**
 * @me
 * Mongoose Schema for db
 */
export class UserModel extends Schema {
    constructor() {

        const user: any = super({
                nonce: {
                    type: Number,
                    default: Math.floor(Math.random() * 1000000)
                },
                publicAddress: {
                    type: String,
                    unique: true,
                    trim: true,
                    lowercase: true
                },
                username: {
                    type: String,
                    unique: true
                }
            },
            {timestamps: true});

    }
}

let user: UserModel = new UserModel();
export const userModel: Model<Document> = model('users', user);
export default userModel;
