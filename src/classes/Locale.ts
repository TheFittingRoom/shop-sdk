import ErrorHandler from './ErrorHandler';
import { ErrorType } from '../types';
export class Locale {
    static strings = {
      Strings: {
        title: "Virtual try on with (de)",
        emailAddress: "Email address (de)",
        password: "Password (de)",
        signBackIn: "Sign back in (de)",
        signUp: "Sign up (de)",
        signOut: "Sign out (de)",
        signIn: "Sign in (de)",
        forgotPassword: "Forgot password (de)",
        backToSignIn: "Back to sign in (de)",
        send: "Send (de)",
        returnToSignIn: "Return to sign in (de)",
        forgotPasswordWithSymbol: "Forgot password? (de)",
        dontHaveAcc: "Don't have an account? (de)",
        howItWorks: "How it works (de)",
        howItWorksText: "The Fitting Room has partnered with your favourite designers to enable you to virtually try on garments, so you will know exactly how it will look before purchasing. Say good-bye to the days of dealing with returns! (de)",
        simplyScan: "Simply scan,(de)",
        simplyScanText: "Download The Fitting Room app, create an account, follow the easy set up steps, and then scan yourself using just your smartphone to create your personal lifelike avatar. (de)",
        tryOn: "and try on. (de)",
        tryOnText: "After creating your avatar, return here and sign in. We will use the measurements from your avatar to tell you which size will fit you best, as well as let you try the garment on - all without leaving your house! (de)",
        or: "Or(de)",
        dontHaveAvatar: "Whoops! Looks like you don't have an avatar yet. (de)",
        createAvatar: "Scan the QR code to return to app to create your avatar. (de)",
        returnToTfr: "Please return to The Fitting Room app to create your avatar. (de)",
        successfullyLoggedOut: "You have successfully logged out! (de)",
        returnToSite: "Return to site (de)",
        modalTitle: "Enter your email address to be notified when The Fitting Room try on is offered on Google Play: (de)",
        enterEmailAddress: "Enter your email address, we will send you a link to reset your password. (de)",
        noSizeAvailable: "Unfortunately, that size is not available for try on. (de)",
        trySize: "You can try on a size (de)",
        orSize: "or size (de)",
        associatedEmail: "If there is an account associated with that email, We have sent a link to reset your password. (de)",
        createAvatarSc: "Scan the QR code to download our app and create an avatar: (de)",
        tfrAvailable: "The Fitting Room app is currently available for (de)",
        notifiedGoogle: "I would like to be notified when it is available on Google Play (de)",
        comingSoon: "coming soon! (de)",
        somethingWentWrong: "Something went wrong. Try again (de)"
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