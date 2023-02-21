import { ErrorType } from '../types';
class ErrorHandler {
    static NO_INTERNET: ErrorType = {code: null, errorMessage: 'No Internet'};
    static CLIENT_UNAUTHORIZED: ErrorType = {code: null, errorMessage: 'Client Unauthorized'};
    static UN_ANTICIPATED: ErrorType = {code: null, errorMessage: 'Unanticipated'};
    static WRONG_PASSWORD: ErrorType = {code: null, errorMessage: 'Wrong Password'};
    static INVALID_PASSWORD: ErrorType = {code: null, errorMessage: 'Invalid Password'};
    static INVALID_CREDENTIALS: ErrorType = {code: null, errorMessage: 'Invalid credentials'};
    static INVALID_EMAIL: ErrorType = {code: null, errorMessage: 'Invalid email'};
    static INVALID_DISPLAY_NAME: ErrorType = {code: null, errorMessage: 'Invalid display name'};
    static INVALID_ID_TOKEN: ErrorType = {code: null, errorMessage: 'Invalid id token'};
    static INVALID_EMAIL_VERIFIED: ErrorType = {code: null, errorMessage: 'Invalid email verified'};
    static EMAIL_ALREADY_EXIST: ErrorType = {code: null, errorMessage: 'Email already exist'};
    static ID_TOKEN_EXPIRED: ErrorType = {code: null, errorMessage: 'Id token expired'};
    static INVALID_ARGUMENT: ErrorType = {code: null, errorMessage: 'Invalid argument'};
    static ID_TOKEN_REVOKED: ErrorType = {code: null, errorMessage: 'Id token revoked'};
    static USER_NOT_FOUND: ErrorType = {code: null, errorMessage: 'User not found'};

    static OK: ErrorType = {code: 200, errorMessage: 'OK'};

    static MISSING_BRAND_ID: ErrorType = {code: 400, errorMessage: 'Missing brand id'};
    static BAD_REQUEST: ErrorType = {code: 400, errorMessage: 'Bad Request'};
    static UNAUTHORIZED: ErrorType = {code: 401, errorMessage: 'Unauthorized'};
    static FORBIDDEN: ErrorType = {code: 403, errorMessage: 'Forbidden'};
    static NOT_FOUND: ErrorType = {code: 404, errorMessage: 'Not Found'};
    static REQUEST_ENTITY_TOO_LARGE: ErrorType = {code: 413, errorMessage: 'Request Entity Too Large'};

    static INTERNAL_ERROR: ErrorType = {code: 500, errorMessage: 'Internal Error'};

    static getFireBaseError(error: {code: string, message?: string}) {
        if (error.code === 'auth/wrong-password') return this.WRONG_PASSWORD;
        if (error.code === 'auth/invalid-email') return this.INVALID_EMAIL;
        if (error.code === 'auth/invalid-display-name') return this.INVALID_DISPLAY_NAME;
        if (error.code === 'auth/invalid-password') return this.INVALID_PASSWORD;
        if (error.code === 'auth/internal-error') return this.INTERNAL_ERROR;
        if (error.code === 'auth/network-request-failed') return this.NO_INTERNET;
        if (error.code === 'auth/claims-too-large') return this.REQUEST_ENTITY_TOO_LARGE;
        if (error.code === 'auth/user-not-found') return this.USER_NOT_FOUND;
        if (error.code === 'auth/invalid-id-token') return this.INVALID_ID_TOKEN;
        if (error.code === 'auth/invalid-email-verified') return this.INVALID_EMAIL_VERIFIED;
        if (error.code === 'auth/email-already-exists') return this.EMAIL_ALREADY_EXIST;
        if (error.code === 'auth/id-token-expired') return this.ID_TOKEN_EXPIRED;
        if (error.code === 'auth/invalid-argument') return this.INVALID_ARGUMENT;
        if (error.code === 'auth/invalid-credential') return this.INVALID_CREDENTIALS;
        if (error.code === 'auth/id-token-revoked') return this.ID_TOKEN_REVOKED;

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
