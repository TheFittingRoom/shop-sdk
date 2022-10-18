import { ErrorType } from '../types';
class ErrorHandler {
    static BAD_REQUEST: ErrorType = {code: 400, errorMessage: 'Bad Request'};
    static UNAUTHORIZED: ErrorType = {code: 401, errorMessage: 'Unauthorized'};
    static FORBIDDEN: ErrorType = {code: 403, errorMessage: 'Forbidden'};
    static NOT_FOUND: ErrorType = {code: 404, errorMessage: 'Not Found'};

    static getFireBaseError(error: {code: string}) {
        if (error.code === 'auth/invalid-email') return this.BAD_REQUEST;
        if (error.code === 'auth/user-not-found') return this.NOT_FOUND;

        return this.BAD_REQUEST;
    }
}

export default ErrorHandler;
