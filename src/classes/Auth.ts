import * as firebase from "firebase/auth";
import { validateEmail, validatePassword } from "../lib/validations";
import { SignInProps, SignInResponse, PasswordResetEmailProps, ErrorType } from "../types";
import ErrorHandler from "./ErrorHandler";
import { FirebaseInstance } from "./Firebase";
class Auth {
    static async signIn({ email, password }: SignInProps): Promise<SignInResponse | ErrorType | void> {
        if (!validateEmail(email) || !validatePassword(password)) {
            return ErrorHandler.BAD_REQUEST;
        }

        try {
            await firebase.signInWithEmailAndPassword(FirebaseInstance.auth, email, password);

            window.theFittingRoom.closeModal();
        } catch (error) {
            return ErrorHandler.getFireBaseError(error);
        }
    }

    static async signOut(): Promise<void | ErrorType> {
        try {
            await firebase.signOut(FirebaseInstance.auth);

            window.theFittingRoom.renderSuccessModal();
        } catch (error) {
            return ErrorHandler.getFireBaseError(error);
        }
    }

    static async sendPasswordResetEmail({ email }: PasswordResetEmailProps): Promise<ErrorType | void> {
        if (!validateEmail(email)) {
            return ErrorHandler.BAD_REQUEST;
        }

        try {
            await firebase.sendPasswordResetEmail(FirebaseInstance.auth, email);
            window.theFittingRoom.renderResetLinkModal();
        } catch (error) {
            return ErrorHandler.getFireBaseError(error);
        }
    }

    static isLoggedIn() {
        return Boolean(FirebaseInstance.auth.currentUser);
    }
}

export default Auth;
