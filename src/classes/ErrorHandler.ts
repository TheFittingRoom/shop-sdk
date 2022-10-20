import { ErrorType } from '../types';
class ErrorHandler {
    static NO_CONTENT: ErrorType = {code: 204, errorMessage: 'No Content'};
    static BAD_REQUEST: ErrorType = {code: 400, errorMessage: 'Bad Request'};
    static NOT_FOUND: ErrorType = {code: 404, errorMessage: 'Not Found'};
    static BAD_GATEWAY: ErrorType = {code: 502, errorMessage: 'Bad Gateway'};

    static getFireBaseError(error: {code: string}) {
        if (error.code === 'auth/invalid-email') return this.BAD_REQUEST;
        if (error.code === 'auth/user-not-found') return this.NO_CONTENT;
        if (error.code === 'auth/network-request-failed') return this.BAD_GATEWAY;

        // Todo - we'll add more cases

        return this.BAD_REQUEST;
    }
}

export default ErrorHandler;
