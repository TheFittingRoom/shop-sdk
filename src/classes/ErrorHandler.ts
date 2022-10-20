import { ErrorType } from '../types';
class ErrorHandler {
    static NO_INTERNET: ErrorType = {code: null, errorMessage: 'No Internet'};
    static UN_ANTICIPATED: ErrorType = {code: null, errorMessage: 'Unanticipated'}
    static NO_CONTENT: ErrorType = {code: 204, errorMessage: 'No Content'};
    static BAD_REQUEST: ErrorType = {code: 400, errorMessage: 'Bad Request'};
    static UNAUTHORIZED: ErrorType = {code: 401, errorMessage: 'Unauthorized'};
    static NOT_FOUND: ErrorType = {code: 404, errorMessage: 'Not Found'};

    static getFireBaseError(error: {code: string}) {
        if (error.code === 'auth/invalid-email') return this.BAD_REQUEST;
        if (error.code === 'auth/user-not-found') return this.NO_CONTENT;
        if (error.code === 'auth/network-request-failed') return this.NO_INTERNET;

        return this.UN_ANTICIPATED;
    }

    static getError(code: number) {
        if (code === 204) return this.NO_CONTENT;
        if (code === 400) return this.BAD_REQUEST;
        if (code === 401) return this.UNAUTHORIZED;
        if (code === 404) return this.NOT_FOUND;

        return this.UN_ANTICIPATED;
    }
}

export default ErrorHandler;
