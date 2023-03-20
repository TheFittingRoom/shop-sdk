import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { AuthErrorCodes } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { FriendlyError } from "../api/FriendlyError";


function GetFriendlyFirebaseError(e: FirebaseError): FriendlyError {
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

class Firebase {
	static apiKey: string;
	static authDomain: string;
	static projectId: string;
	static storageBucket: string;
	static messagingSenderId: string;
	static appID: string;

	public static App: firebase.FirebaseApp;
	public static Auth: firebaseAuth.Auth;
	public static Firestore: Firestore;

	static Init(apiKey: string, authDomain: string, projectId: string, storageBucket: string, messagingSenderId: string, appId: string) {
		this.apiKey = apiKey;
		this.authDomain = authDomain;
		this.projectId = projectId;
		this.storageBucket = storageBucket;
		this.messagingSenderId = messagingSenderId;
		this.appID = appId;

		if (!this.App) {
			this.App = firebase.initializeApp({
				apiKey: this.apiKey,
				authDomain: this.authDomain,
				projectId: this.projectId,
				storageBucket: this.storageBucket,
				messagingSenderId: this.messagingSenderId,
				appId: this.appID
			});

			this.Auth = firebaseAuth.getAuth(this.App)
			this.Firestore = getFirestore(this.App);
		}
	}



	// this not belong here even though its related to firebase, its not really static
	/* 	static GetJWT() {
			if (!this.firebaseAuthInstance) {
				throw new Error("Firebase not initialized");
			}
			return this.firebaseAuthInstance.currentUser.getIdToken();
		} */
}

export { Firebase, GetFriendlyFirebaseError };

