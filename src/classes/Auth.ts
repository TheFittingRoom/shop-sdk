import * as firebase from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { showHideElement } from "../lib/updaters";
import { SignInProps, SignInResponse, PasswordResetEmailProps, ErrorType, AvatarState } from "../types";
import ErrorHandler from "./ErrorHandler";
import { FirebaseInstance } from "./Firebase";
import { Locale } from "./Locale";

const { Strings } = Locale.getLocale();
const { signOutErrorText, sendPasswordResetEmailErrorText } = Strings;

class Auth {
    static async signIn({ email, password }: SignInProps): Promise<SignInResponse | ErrorType | void> {
        // if (!validateEmail(email) || !validatePassword(password)) {
        //     return ErrorHandler.INVALID_CREDENTIALS;
        // }

        try {
            await firebase.signInWithEmailAndPassword(FirebaseInstance.auth, email, password);

            const userProfile = await Auth.listenToUserProfile();

            const signOutButton = document.getElementById("thefittingroom-signout-button");
            showHideElement(true, signOutButton);

            const event = new Event('TheFittingRoomUser');
            // Dispatch the event.
            window.dispatchEvent(event);

            if (userProfile?.avatar_status === AvatarState.PENDING) {
                window.theFittingRoom.renderLoadingAvatarModal();
            }

            if (userProfile?.avatar_status === AvatarState.NOT_CREATED) {
                window.theFittingRoom.renderScanCodeModal();
            }

            if (userProfile?.avatar_status === AvatarState.CREATED) {
                window.theFittingRoom.closeModal();
            }

        } catch (error) {
            return ErrorHandler.getFireBaseError({code: 'auth/invalid-credential'});
        }
    }

    static async signOut(): Promise<void | ErrorType> {
        try {
            await firebase.signOut(FirebaseInstance.auth);

            const signOutButton = document.getElementById("thefittingroom-signout-button")
            showHideElement(false, signOutButton)

            window.theFittingRoom.renderSuccessModal();
        } catch (error) {
            window.theFittingRoom.renderErrorModal({errorText: signOutErrorText});
            return ErrorHandler.getFireBaseError(error);
        }
    }

    static async sendPasswordResetEmail({ email }: PasswordResetEmailProps): Promise<ErrorType | void | string> {
        try {
            await firebase.sendPasswordResetEmail(FirebaseInstance.auth, email);

            window.theFittingRoom.renderResetLinkModal();
        } catch (error) {
            const errData = ErrorHandler.getFireBaseError(error);

            if (errData?.errorMessage) {
                return errData?.errorMessage;
            } else {
                window.theFittingRoom.renderErrorModal({ errorText: sendPasswordResetEmailErrorText });
            }
        }
    }

    static async listenToUserProfile(): Promise<any> {
        const userId = FirebaseInstance.auth.currentUser.uid;
        const db = FirebaseInstance.firestoreApp;

        const myPromise = new Promise((resolve) => {
          onSnapshot(doc(db, 'users', userId), (doc) => {
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

        return myPromise;
    }

    static async getUserProfile(): Promise<any> {
        try {
            const userId = FirebaseInstance.auth.currentUser.uid;
            const db = FirebaseInstance.firestoreApp;
        
            const querySnapshot = await getDoc(doc(db, 'users', userId));
            const userProfile = querySnapshot.data();

            return userProfile;
        } catch (error) {
            throw Error(error);
        }
    }

    static isLoggedIn() {
        return Boolean(FirebaseInstance.auth.currentUser);
    }
}

export default Auth;
