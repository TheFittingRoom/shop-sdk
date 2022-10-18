import ErrorHandler from './ErrorHandler';
import { ErrorType } from '../types';
export class Locale {
    static strings = {
      Strings: {
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
        dontHaveAcc: "Don't have an account?",
        howItWorks: "How it works",
        howItWorksText: "The Fitting Room has partnered with your favourite designers to enable you to virtually try on garments, so you will know exactly how it will look before purchasing. Say good-bye to the days of dealing with returns!",
        simplyScan: "Simply scan,",
        simplyScanText: "Download The Fitting Room app, create an account, follow the easy set up steps, and then scan yourself using just your smartphone to create your personal lifelike avatar.",
        tryOn: "and try on.",
        tryOnText: "After creating your avatar, return here and sign in. We will use the measurements from your avatar to tell you which size will fit you best, as well as let you try the garment on - all without leaving your house!",
        or: "Or",
        dontHaveAvatar: "Whoops! Looks like you don't have an avatar yet.",
        createAvatar: "Scan the QR code to return to app to create your avatar.",
        returnToTfr: "Please return to The Fitting Room app to create your avatar.",
        successfullyLoggedOut: "You have successfully logged out!",
        returnToSite: "Return to site",
        modalTitle: "Enter your email address to be notified when The Fitting Room try on is offered on Google Play:",
        enterEmailAddress: "Enter your email address, we will send you a link to reset your password.",
        noSizeAvailable: "Unfortunately, that size is not available for try on.",
        trySize: "You can try on a size",
        orSize: "or size",
        associatedEmail: "If there is an account associated with that email, We have sent a link to reset your password.",
        createAvatarSc: "Scan the QR code to download our app and create an avatar:",
        tfrAvailable: "The Fitting Room app is currently available for",
        notifiedGoogle: "I would like to be notified when it is available on Google Play",
        comingSoon: "coming soon!",
        somethingWentWrong: "Something went wrong. Try again"
      }
    }

    static async setLocale(locale: string): Promise<void | ErrorType> {
        fetch(`https://cdn.jsdelivr.net/gh/arbershabani1/tfr-languages@c6845f1df46cf253af7d8100e83f1fcfa002410c/${locale}.json`)
        .then((response) => response.json())
        .then((data) => {
            this.strings = data;
        })
        .catch(() => {
            return ErrorHandler.NOT_FOUND;
        });
    };

    static getLocale() {
        return this.strings;
    }
}