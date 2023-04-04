import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { AuthErrorCodes } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { createUIError, UIError } from "../api/UIError";
import { UserCredential } from "firebase/auth";
import { getDoc, doc, DocumentData, onSnapshot, DocumentSnapshot, } from "firebase/firestore";
import { PasswordResetEmailProps } from "../types";
import {L} from "../api/Locale";

function GetFirebaseUIError(e: FirebaseError): UIError {
	switch (e.code) {
		case AuthErrorCodes.INVALID_EMAIL:
			return createUIError('Your email or password is incorrect', new Error(e.message));
		case AuthErrorCodes.INVALID_PASSWORD:
			return createUIError('Your email or password is incorrect', new Error(e.message));
		case AuthErrorCodes.USER_DELETED:
			return createUIError('Your email or password is incorrect', new Error(e.message));
		case AuthErrorCodes.USER_DISABLED:
			return createUIError('Your account has been disabled', );
		case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
			return createUIError('Too many failed login attempts. Please try again later', new Error(e.message));
		case AuthErrorCodes.OPERATION_NOT_ALLOWED:
			return createUIError('This sign-in provider is disabled', new Error(e.message));
		default:
			return createUIError('An unknown error has occurred', new Error(e.message));
	}
}

interface FirebaseInstance {
	App: firebase.FirebaseApp;
	Auth: firebaseAuth.Auth;
	Firestore: Firestore;
	/* 	SendPasswordResetEmail: (email: string) => Promise<void>;
		ConfirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
		Login: (username: string, password: string, onLogout: () => Promise<void>) => Promise<FirebaseUser>; */
}

const NotLoggedIn = new Error('user not logged in');

interface FirebaseUser {
	User: firebaseAuth.User | null;
	FirebaseInstance: FirebaseInstance;
	EnsureLogin: () => void;
	ID: () => string;
	Token: () => Promise<string>;
	GetUserProfile: () => Promise<DocumentData | null>;
	SignOut: () => Promise<void>;
}


const InitFirebaseUser = (firebase: FirebaseInstance, user: firebaseAuth.User, onLogout: () => Promise<void>): FirebaseUser => {
	let FirebaseInstance = firebase;
	let User = user;

	let EnsureLogin = () => {
		if (user === null) {
			throw NotLoggedIn;
		}
	};

	let ID = () => {
		try {
			return User.uid;
		} catch (error) {
			throw NotLoggedIn;
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
					onLogout().then(() => {
						resolve();
					}).catch((error) => {
						reject(error);
					});
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

const InitFirebase = () => {
	let App = firebase.initializeApp({
		apiKey: process.env.FIREBASE_API_KEY,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN,
		projectId: process.env.FIREBASE_PROJECT_ID,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.FIREBASE_APP_ID,
	});

	let Auth = firebaseAuth.getAuth(App);
	Auth.setPersistence(firebaseAuth.browserLocalPersistence)
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

	const User = (onLogout: () => Promise<void>): Promise<FirebaseUser> => {
		return new Promise((resolve, reject) => {
			let unsubscribe = firebaseAuth.onAuthStateChanged(Auth, async (user) => {
				if (user) {
					unsubscribe()
					resolve(InitFirebaseUser(instance,user, onLogout));
				} else {
					unsubscribe()
					reject(NotLoggedIn);
				}
			});
		})
	};

	const Login = (username, password: string, onLogout: () => Promise<void>): Promise<FirebaseUser> => {
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
		FirebaseInstance: instance,
		SendPasswordResetEmail,
		ConfirmPasswordReset,
		Login,
		User
	};
};

export { InitFirebase, InitFirebaseUser, FirebaseUser, NotLoggedIn}

