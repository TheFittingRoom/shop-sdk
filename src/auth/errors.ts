import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";
import {FirebaseUser} from "./FirebaseUser";


class FriendlyError extends Error {
	private friendlyMessage: string;

	constructor(friendyMessage: string, message?: string) {
		super(message)
		this.friendlyMessage = friendyMessage;
	}

	Friendly(): string {
		return this.friendlyMessage;
	}
}

function GetFriendlyFirebaseError(e: FirebaseError): FriendlyError{
	switch (e.code) {
		case AuthErrorCodes.INVALID_EMAIL:
			return new FriendlyError('Your email or password is incorrect', e.message);
		case AuthErrorCodes.INVALID_PASSWORD:
			return new FriendlyError('Your email or password is incorrect', e.message);
		case AuthErrorCodes.USER_DELETED:
			return new FriendlyError('Your email or password is incorrect', e.message);
		case AuthErrorCodes.USER_DISABLED:
			return new FriendlyError('Your account has been disabled');
		case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
			return new FriendlyError('Too many failed login attempts. Please try again later', e.message);
		case AuthErrorCodes.OPERATION_NOT_ALLOWED:
			return new FriendlyError('This sign-in provider is disabled', e.message);
		default:
			return new FriendlyError('An unknown error has occurred', e.message);
	}
}




export { FriendlyError, GetFriendlyFirebaseError, FirebaseUser }
