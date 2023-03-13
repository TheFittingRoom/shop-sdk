import * as firebaseAuth from "firebase/auth";
import { GetFriendlyFirebaseError, FriendlyError } from "./errors";
import { getDoc, doc, DocumentData, onSnapshot, DocumentSnapshot, } from "firebase/firestore";
import {PasswordResetEmailProps } from "../types";
import { Firebase as Firebase } from "./Firebase";




class FirebaseUser {
	static UserCredential: firebaseAuth.UserCredential;

	public static UserNotLoggedIn = new Error('user not logged in');

	/**
	* Sign in with email and password
	* @throws UserNotLoggedIn
	*/
	static async Login(auth: firebaseAuth.Auth, username, password: string): Promise<firebaseAuth.UserCredential> {
		return new Promise((resolve, reject) => {
			firebaseAuth.signInWithEmailAndPassword(auth, username, password)
				.then((userCredential) => {
					this.UserCredential = userCredential;
					resolve(userCredential);
				}).catch((error) => {
					reject(GetFriendlyFirebaseError(error));
				})
		})
	}

	/**
	 * Ensures that the user is logged in
	 * @throws UserNotLoggedIn
	 */
	static EnsureLogin(): void {
		if (FirebaseUser.UserCredential === null) {
			throw FirebaseUser.UserNotLoggedIn;
		}
	}

	/**
	 * Returns the user's ID
	 * @throws UserNotLoggedIn
	 */
	static ID(): string {
		try{
			return FirebaseUser.UserCredential.user.uid;
		} catch(error){
			throw FirebaseUser.UserNotLoggedIn;
		}
	}

	/**
	 * Returns the user's JWT Token
	 * @throws UserNotLoggedIn
	 */
	static async Token(): Promise<string> {
		this.EnsureLogin();
		return new Promise((resolve, reject) => {
			FirebaseUser.UserCredential.user.getIdToken()
				.then((token) => {
					resolve(token);
				}).catch((error) => {
					reject(error);
				})
		})
	}

	/**
	 * Returns the user profile
	 * @throws UserNotLoggedIn
	 */
	static async GetUserProfile(): Promise<DocumentData | FriendlyError> {
		this.EnsureLogin()
		return new Promise((resolve, reject) => {
			getDoc(doc(Firebase.Firestore, 'users', FirebaseUser.ID()))
				.then((documentSnapshot: DocumentSnapshot<DocumentData>) => {
					resolve(documentSnapshot.data())
				}).catch((error) => {
					reject(new FriendlyError('Unable to load user data. Please try refreshing', error))
				})
			})
	}

	/**
	 * Listens to the user profile and dispatches a 'userProfile' event when the user profile changes.
	 * @throws UserNotLoggedIn
	 */
	static async ListenToUserProfile(): Promise<any> {
		this.EnsureLogin()
		const db = Firebase.Firestore;

		return new Promise((resolve) => {
			onSnapshot(doc(db, 'users', FirebaseUser.ID()), (doc) => {
				const userProfile = doc.data();

				const userProfileEvent = new CustomEvent('userProfile', {
					detail: {
						userProfile: userProfile
					}
				});
				document.dispatchEvent(userProfileEvent);
				resolve(userProfile);
			})
		});
	}

 /**
  * Sends a password reset email to the given email address.
  * @param {PasswordResetEmailProps} email - the email address to send the password reset email to.
  * @returns None
  */
	static async SendPasswordResetEmail({ email }: PasswordResetEmailProps): Promise<void> {
		this.EnsureLogin()
		await firebaseAuth.sendPasswordResetEmail(Firebase.Auth, email).catch((error) => {
			throw GetFriendlyFirebaseError(error);
		})
	}

 /**
  * Signs the user out of Firebase.
  * @returns None
  */
	static async SignOut(): Promise<void> {
		return new Promise((resolve, reject) => {
			firebaseAuth.signOut(Firebase.Auth)
			.then(() => {
				this.UserCredential = null;
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
		})
	}
}

export { FirebaseUser };
