import * as firebase from "firebase/auth";
import { showHideElement } from "../lib/updaters";
import { validateEmail, validatePassword } from "../lib/validations";
import { SignInProps, SignInResponse, PasswordResetEmailProps, ErrorType, ProfileResponse } from "../types";
import ErrorHandler from "./ErrorHandler";
import { FirebaseInstance } from "./Firebase";
import { Locale } from "./Locale";
import { getProfile } from "./Profile";

const { Strings } = Locale.getLocale();
const { signOutErrorText } = Strings;
class Auth {
    static async signIn({ email, password }: SignInProps): Promise<SignInResponse | ErrorType | void> {
        if (!validateEmail(email) || !validatePassword(password)) {
            return ErrorHandler.BAD_REQUEST;
        }

        try {
            await firebase.signInWithEmailAndPassword(FirebaseInstance.auth, email, password);
            const data: ProfileResponse | ErrorHandler = await getProfile();

            const signOutButton = document.getElementById("thefittingroom-signout-button");
            showHideElement(true, signOutButton);

            if ('hasAvatar' in data && data?.hasAvatar) {
                window.theFittingRoom.renderScanCodeModal();
            }
            if ('hasAvatar' in data && data?.hasAvatar === false) {
                window.theFittingRoom.renderNoAvatarModal();
            }
        } catch (error) {
            return ErrorHandler.getFireBaseError(error);
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
