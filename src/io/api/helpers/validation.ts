import {errorMessageHandler} from './error.message.handler';
import { STATUS_CODES } from 'http';
import { StatusCodes } from '@helpers/status.codes';

export class Validation {
    constructor() {
    }

    public _validateDataObject(dataObject: any, validateObject: [any]): boolean {
        for (let validate of validateObject) {
            if (!dataObject.hasOwnProperty(validate.field)) {
                let errorMessage: { message, status } = errorMessageHandler.getErrorMessage(validate.code);

                throw  {
                    code: validate.code,
                    status: errorMessage.status
                };
            }
        }
        return true;
    }

    public checkPasswordStrength(password: any): boolean {
        let passwordStrength = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        if (password.length < 8) {
            throw  {
                code: StatusCodes.PASSWORD_TO_SHORT,
                status: 403
            };
        } else if (false === passwordStrength.test(password)) {
            throw  {
                code: StatusCodes.WEAK_PASSWORD,
                status: 403
            };
        }
        return true;
    }
}

export const validateData: Validation = new Validation();
