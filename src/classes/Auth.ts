import * as firebase from "firebase/auth";
import { updateSignInButton } from "../lib/previewModal";
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

            updateSignInButton();

            window.theFittingRoom.renderScanCodeModal();
        } catch (error) {
            return ErrorHandler.getFireBaseError(error);
        }
    }

    static async signOut(): Promise<void | ErrorType> {
        try {
            await firebase.signOut(FirebaseInstance.auth);

            updateSignInButton();

            window.theFittingRoom.renderSuccessModal();
        } catch (error) {
            window.theFittingRoom.renderErrorModal();
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
