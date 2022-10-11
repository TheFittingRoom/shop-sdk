/**
 * The server cannot or will not process the request due to an apparent client error
 * (e.g., malformed request syntax, too large size, invalid request message framing, or deceptive request routing).
 */
// BAD_REQUEST = 400
/**
 * Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet
 * been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the
 * requested resource. See Basic access authentication and Digest access authentication. 401 semantically means
 * "unauthenticated",i.e. the user does not have the necessary credentials.
 */
// UNAUTHORIZED = 401
/**
 * The request was valid, but the server is refusing action.
 * The user might not have the necessary permissions for a resource.
 */
// FORBIDDEN = 403
/**
 * The requested resource could not be found but may be available in the future.
 * Subsequent requests by the client are permissible.
 */
// NOT_FOUND = 404

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
