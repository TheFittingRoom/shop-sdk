import * as firebase from "firebase/auth";
import { validateEmail, validatePassword } from "../lib/validations";
import { SignInProps, SignInResponse, PasswordResetEmailProps } from "../types";
import { FirebaseInstance } from "./Firebase";
class Auth {
    static async signIn({ email, password }: SignInProps): Promise<SignInResponse | string | void> {
        if (!validateEmail(email) || !validatePassword(password)) {
            return "Wrong credentials";
        }

        try {
            await firebase.signInWithEmailAndPassword(FirebaseInstance.auth, email, password);

            window.theFittingRoom.closeModal();
        } catch (error) {
            console.log("signIn error: ", error);
            return "Something went wrong. Try again!";
        }
    }

    static async signOut(): Promise<any> {
        try {
            const data = await firebase.signOut(FirebaseInstance.auth);

            window.theFittingRoom.renderSuccessModal();
    
            return data;
        } catch (error) {
            console.log("signOut error: ", error);
            throw new Error(error);
        }
    }

    static async sendPasswordResetEmail({ email }: PasswordResetEmailProps): Promise<string | void> {
        if (!validateEmail(email)) {
            return "Not a valid email";
        }
    
        try {
            await firebase.sendPasswordResetEmail(FirebaseInstance.auth, email);
            window.theFittingRoom.renderResetLinkModal();
        } catch (error) {
            return "Invalid email";
        }
    }
}

export default Auth;
