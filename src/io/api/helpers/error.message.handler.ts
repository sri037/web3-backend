import { StatusCodes } from './status.codes';

class ErrorMessageHandler {

    constructor() {

    }

    public getErrorMessage(errorObj: any): { message, status } {
        let code: any;
        let status: any;
        if (errorObj) {
            switch (errorObj) {
                case StatusCodes.USER_NOT_FOUND:
                    status = 401;
                    break;
                case StatusCodes.MISSING_CREDENTIALS:
                    code = 'Both email and password are required.';
                    status = 422;
                    break;
                case StatusCodes.MISMATCH_CREDENTIALS:
                    code = 'Email and password does not match.';
                    status = 401;
                    break;
                case StatusCodes.EMAIL_ALREADY_EXISTS:
                    code = 'Email already registered. Please login.';
                    status = 422;
                    break;
                case StatusCodes.USER_VERIFICATION_PENDING:
                    code = 'Your email verification is Pending.';
                    status = 400;
                    break;

                default:
                    code = errorObj;
                    status = 422;
            }
        } else if (errorObj.message && !errorObj.errors) {
            code = errorObj.message;
        } else {
            code = [];
            for (let errName in errorObj.errors) {
                if (errorObj.errors.hasOwnProperty(errName)) {
                    if (errorObj.errors[errName].hasOwnProperty('code')) {
                        code.push(errorObj.errors[errName]);
                        status = 400;
                    } else {
                        code.push(errorObj.errors[errName].message);
                        status = 400;
                    }
                }
            }
        }
        return {message: code, status};
    }
}

export const errorMessageHandler: ErrorMessageHandler = new ErrorMessageHandler();
