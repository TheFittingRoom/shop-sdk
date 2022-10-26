import { ErrorType } from '../types';
class ErrorHandler {
    static NO_INTERNET: ErrorType = {code: null, errorMessage: 'No Internet'};
    static CLIENT_UNAUTHORIZED: ErrorType = {code: null, errorMessage: 'Client Unauthorized'};
    static UN_ANTICIPATED: ErrorType = {code: null, errorMessage: 'Unanticipated'};
    static WRONG_PASSWORD: ErrorType = {code: null, errorMessage: 'Wrong Password'};

    static OK: ErrorType = {code: 200, errorMessage: 'OK'};

    static BAD_REQUEST: ErrorType = {code: 400, errorMessage: 'Bad Request'};
    static UNAUTHORIZED: ErrorType = {code: 401, errorMessage: 'Unauthorized'};
    static FORBIDDEN: ErrorType = {code: 403, errorMessage: 'Forbidden'};
    static NOT_FOUND: ErrorType = {code: 404, errorMessage: 'Not Found'};
    static REQUEST_ENTITY_TOO_LARGE: ErrorType = {code: 413, errorMessage: 'Request Entity Too Large'};

    static INTERNAL_ERROR: ErrorType = {code: 500, errorMessage: 'Internal Error'};

    static getFireBaseError(error: {code: string, message?: string}) {
        if (error.code === 'auth/wrong-password') return this.WRONG_PASSWORD;
        if (error.code === 'auth/invalid-email') return this.BAD_REQUEST;
        if (error.code === 'auth/invalid-display-name') return this.BAD_REQUEST;
        if (error.code === 'auth/invalid-password') return this.BAD_REQUEST;
        if (error.code === 'auth/internal-error') return this.INTERNAL_ERROR;
        if (error.code === 'auth/network-request-failed') return this.NO_INTERNET;
        if (error.code === 'auth/claims-too-large') return this.REQUEST_ENTITY_TOO_LARGE;
        if (error.code === 'auth/user-not-found') return this.NOT_FOUND;
        if (error.code === 'auth/invalid-id-token') return this.BAD_REQUEST;
        if (error.code === 'auth/invalid-email-verified') return this.BAD_REQUEST;
        if (error.code === 'auth/email-already-exists') return this.BAD_REQUEST;
        if (error.code === 'auth/id-token-expired') return this.UNAUTHORIZED;
        if (error.code === 'auth/invalid-argument') return this.BAD_REQUEST;
        if (error.code === 'auth/invalid-credential') return this.BAD_REQUEST;
        if (error.code === 'auth/id-token-revoked') return this.UNAUTHORIZED;

        return this.UN_ANTICIPATED;
    }

    static getError(code: number) {
        if (code === 200) return this.OK;
        if (code === 400) return this.BAD_REQUEST;
        if (code === 401) return this.UNAUTHORIZED;
        if (code === 403) return this.FORBIDDEN;
        if (code === 404) return this.NOT_FOUND;
        if (code === 413) return this.REQUEST_ENTITY_TOO_LARGE;
        if (code === 500) return this.INTERNAL_ERROR;

        return this.UN_ANTICIPATED;
    }
}

export default ErrorHandler;
