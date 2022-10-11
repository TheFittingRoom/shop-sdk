import Api from './Api';
import ErrorHandler from './ErrorHandler';
import { ErrorType } from '../types';
export class Locale {
    static strings = {
        Texts: {
            title: "Virtual try on with",
            emailAddress: "Email address",
            password: "Password",
            signBackIn: "Sign back in",
            signUp: "Sign up",
            signOut: "Sign out",
            signIn: "Sign in",
            forgotPassword: "Forgot password",
            backToSignIn: "Back to sign in",
            send: "Send",
            returnToSignIn: "Return to sign in",
            forgotPasswordWithSymbol: "Forgot password?",
            dontHaveAcc: "Don't have an account?"
        },
        NoAvatarModalTexts: {
            dontHaveAvatar: "Whoops! Looks like you don't have an avatar yet.",
            createAvatar: "Scan the QR code to return to app to create your avatar.",
        },
        SuccessModalTexts: {
            successfullyLoggedOut: "You have successfully logged out!",
            returnToSite: "Return to site"
        },
        EnterEmailModalTexts: {
            modalTitle: "Enter your email address to be notified when The Fitting Room try on is offered on Google Play:"
        },
        ForgotPasswordModalTexts: {
            enterEmailAddress: "Enter your email address, we will send you a link to reset your password."
        },
        ErrorModal: {
            noSizeAvailable: "Unfortunately, that size is not available for try on.",
            trySize: "You can try on a size",
            orSize: "or size"
        },
        ResetLinkModalTexts: {
            associatedEmail: "If there is an account associated with that email, We have sent a link to reset your password."
        },
        ScanCodeModalTexts: {
            createAvatar: "Scan the QR code to download our app and create an avatar:",
            tfrAvailable: "The Fitting Room app is currently available for",
            notifiedGoogle: "I would like to be notified when it is available on Google Play",
            comingSoon: "coming soon!"
        }
    };

    static async setLocale(locale: string): Promise<void | ErrorType> {
        try {
            const data = await Api.get(`/language/${locale}`);

            this.strings = data.strings;
        } catch (error) {
            return ErrorHandler.NOT_FOUND;
        }
    };

    static getLocale() {
        return this.strings;
    }
}