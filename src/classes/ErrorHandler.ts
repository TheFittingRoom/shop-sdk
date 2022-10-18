import { ErrorType } from '../types';
class ErrorHandler {
    static NO_CONTENT: ErrorType = {code: 204, errorMessage: 'No Content'};
    static BAD_REQUEST: ErrorType = {code: 400, errorMessage: 'Bad Request'};
    static UNAUTHORIZED: ErrorType = {code: 401, errorMessage: 'Unauthorized'};
    static FORBIDDEN: ErrorType = {code: 403, errorMessage: 'Forbidden'};
    static NOT_FOUND: ErrorType = {code: 404, errorMessage: 'Not Found'};
    static BAD_GATEWAY: ErrorType = {code: 502, errorMessage: 'Bad Gateway'};

    static getFireBaseError(error: {code: string}) {
        if (error.code === 'auth/invalid-email') return this.BAD_REQUEST;
        if (error.code === 'auth/user-not-found') return this.NO_CONTENT;
        if (error.code === 'auth/network-request-failed') return this.BAD_GATEWAY;

        return this.BAD_REQUEST;
    }
}

export default ErrorHandler;
