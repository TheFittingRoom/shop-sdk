import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { AuthErrorCodes } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { createUIError, UIError } from "../api/UIError";
import { getDoc, doc, DocumentData, DocumentSnapshot, } from "firebase/firestore";
import * as types from "../types";

function GetFirebaseUIError(e: FirebaseError): UIError {
	switch (e.code) {
		case AuthErrorCodes.INVALID_EMAIL:
		case AuthErrorCodes.INVALID_PASSWORD:
		case AuthErrorCodes.USER_DELETED:
			return createUIError('Your email or password is incorrect', new Error(e.message));
		case AuthErrorCodes.USER_DISABLED:
			return createUIError('Your account has been disabled',);
		case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
			return createUIError('Too many failed login attempts. Please try again later', new Error(e.message));
		case AuthErrorCodes.OPERATION_NOT_ALLOWED:
			return createUIError('This sign-in provider is disabled', new Error(e.message));
		default:
			return createUIError('An unknown error has occurred', new Error(e.message));
	}
}


const InitFirebaseUser = (firebase: types.Firebase, user: firebaseAuth.User, onLogout: () => void): types.FirebaseUser => {
	let FirebaseInstance = firebase;
	let User = user;

	let EnsureLogin = () => {
		if (user === null) {
			throw types.NotLoggedIn;
		}
	};

	let ID = () => {
		try {
			return User.uid;
		} catch (error) {
			throw types.NotLoggedIn;
		}
	};

	let Token = (): Promise<string> => {
		EnsureLogin();
		return new Promise((resolve, reject) => {
			User.getIdToken()
				.then((token) => {
					resolve(token);
				}).catch((error) => {
					reject(error);
				});
		});
	};

	let GetUserProfile = () => {
		EnsureLogin();
		return new Promise((resolve, reject) => {
			getDoc(doc(firebase.Firestore, 'users', ID()))
				.then((documentSnapshot: DocumentSnapshot<DocumentData>) => {
					resolve(documentSnapshot.data());
				}).catch((error) => {
					reject(GetFirebaseUIError(error));
				});
		});
	};

	let SignOut = () => {
		return new Promise<void>((resolve, reject) => {
			firebaseAuth.signOut(firebase.Auth)
				.then(async () => {
					User = null;
					onLogout();
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	return {
		User,
		FirebaseInstance,
		EnsureLogin,
		ID,
		Token,
		GetUserProfile,
		SignOut,
	};
};

const InitFirebase = (): types.FirebaseInstance => {
	let App = firebase.initializeApp({
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID,
	});

	let Auth = firebaseAuth.getAuth(App);
	Auth.setPersistence(firebaseAuth.browserLocalPersistence);
	let Firestore = getFirestore(App);

	let instance = {
		App,
		Auth,
		Firestore,
	};

	const SendPasswordResetEmail = (email: string) => {
		return new Promise<void>((resolve, reject) => {
			firebaseAuth.sendPasswordResetEmail(Auth, email).
				then(() => {
					resolve();
				})
				.catch((error) => {
					reject(GetFirebaseUIError(error));
				});
		});
	};

	const ConfirmPasswordReset = (code: string, newPassword: string) => {
		return new Promise<void>((resolve, reject) => {
			firebaseAuth.confirmPasswordReset(Auth, code, newPassword)
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(GetFirebaseUIError(error));
				});
		});
	};

	const User = (onLogout: () => void): Promise<types.FirebaseUser> => {
		return new Promise((resolve, reject) => {
			let unsubscribe = firebaseAuth.onAuthStateChanged(Auth, async (user) => {
				if (user) {
					unsubscribe();
					resolve(InitFirebaseUser(instance, user, onLogout));
				} else {
					unsubscribe();
					reject(types.NotLoggedIn);
				}
			});
		});
	};

	const Login = (username, password: string, onLogout: () => void): Promise<types.FirebaseUser> => {
		return new Promise((resolve, reject) => {
			let auth = firebaseAuth.getAuth(App);
			if (auth.currentUser) {
				resolve(InitFirebaseUser(instance, auth.currentUser, onLogout));
				return;
			} else {
				firebaseAuth.signInWithEmailAndPassword(Auth, username, password)
					.then((userCredential) => {
						resolve(InitFirebaseUser(instance, userCredential.user, onLogout));
					}).catch((error) => {
						reject(GetFirebaseUIError(error));
					});
			}
		});
	};

	return {
		Firebase: instance,
		SendPasswordResetEmail,
		ConfirmPasswordReset,
		Login,
		User
	};
};

export { InitFirebase, InitFirebaseUser, GetFirebaseUIError }

