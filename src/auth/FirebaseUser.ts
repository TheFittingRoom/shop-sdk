import * as firebaseAuth from "firebase/auth";
import { FriendlyError } from "../api/FriendlyError";
import {GetFriendlyFirebaseError} from "./Firebase";
import { getDoc, doc, DocumentData, onSnapshot, DocumentSnapshot, } from "firebase/firestore";
import {PasswordResetEmailProps } from "../types";
import { Firebase } from "./Firebase";
import { UserCredential } from "firebase/auth";
import { onLog } from "firebase/app";




class FirebaseUser {
	UserCredential: firebaseAuth.UserCredential;

	onLogout: () => Promise<any>;

	public static NotLoggedIn = new Error('user not logged in');

	constructor(UserCredential: firebaseAuth.UserCredential, onLogout: () => Promise<any>) {
		this.UserCredential = UserCredential;
	}

	/**
	* Sign in with email and password
	* @throws NotLoggedIn
	*/
	static async Login(username, password: string, onLogout: () => any): Promise<FirebaseUser> {
		return new Promise((resolve, reject) => {
			firebaseAuth.signInWithEmailAndPassword(Firebase.Auth, username, password)
				.then((userCredential) => {
					resolve(new FirebaseUser(userCredential, onLogout));
				}).catch((error) => {
					reject(GetFriendlyFirebaseError(error));
				})
		})
	}

	/**
 * Sends a password reset email to the given email address.
 * @param {PasswordResetEmailProps} email - the email address to send the password reset email to.
 * @throws NotLoggedIn
 */
	static async SendPasswordResetEmail(email: string): Promise<void> {
		return new Promise((resolve, reject) => {
			firebaseAuth.sendPasswordResetEmail(Firebase.Auth, email).
				then(() => {
					resolve();
				})
				.catch((error) => {
					reject(GetFriendlyFirebaseError(error))
				});
		});
	}

	/**
 * Confirms the password reset with the given code and new password.
 * @param {string} code - The password reset code sent to the user.
 * @param {string} newPassword - The new password.
 * @throws NotLoggedIn
 */
	static async ConfirmPasswordReset(code: string, newPassword: string): Promise<void> {
		return new Promise((resolve, reject) => {
			firebaseAuth.confirmPasswordReset(Firebase.Auth, code, newPassword)
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(GetFriendlyFirebaseError(error));
				});
		});
	}

	/**
	 * Ensures that the user is logged in
	 * @throws NotLoggedIn
	 */
	EnsureLogin(): void {
		if (this.UserCredential === null) {
			throw FirebaseUser.NotLoggedIn;
		}
	}

	/**
	 * Returns the user's ID
	 * @throws NotLoggedIn
	 */
	ID(): string {
		try{
			return this.UserCredential.user.uid;
		} catch(error){
			throw FirebaseUser.NotLoggedIn;
		}
	}

	/**
	 * Returns the user's JWT Token
	 * @throws NotLoggedIn
	 */
	async Token(): Promise<string> {
		this.EnsureLogin();
		return new Promise((resolve, reject) => {
			this.UserCredential.user.getIdToken()
				.then((token) => {
					resolve(token);
				}).catch((error) => {
					reject(error);
				})
		})
	}

	/**
	 * Returns the user profile
	 * @throws NotLoggedIn
	 */
	async GetUserProfile(): Promise<DocumentData | FriendlyError> {
		this.EnsureLogin()
		return new Promise((resolve, reject) => {
			getDoc(doc(Firebase.Firestore, 'users', this.ID()))
				.then((documentSnapshot: DocumentSnapshot<DocumentData>) => {
					resolve(documentSnapshot.data())
				}).catch((error) => {
					reject(new FriendlyError('Unable to load user data. Please try refreshing', error))
				})
			})
	}

 /**
  * Signs the user out of Firebase.
  * @returns None
  */
	async SignOut(): Promise<void> {
		return new Promise((resolve, reject) => {
			firebaseAuth.signOut(Firebase.Auth)
			.then(async () => {
				this.UserCredential = null;
				await this.onLogout();
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
		})
	}
}

export { FirebaseUser };
