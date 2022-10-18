import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { updateSignInButton } from "../lib/previewModal";
import ErrorHandler from "./ErrorHandler";
export class FirebaseInstance {
    static auth: firebaseAuth.Auth;

    constructor() {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };
    
        const firebaseApp = firebase.initializeApp(firebaseConfig);

        FirebaseInstance.auth = firebaseAuth.getAuth(firebaseApp);

        firebaseAuth.onAuthStateChanged(FirebaseInstance.auth, () => {
            updateSignInButton();
        })
    }

    static async getTokenId(){
        try {
            const token = await FirebaseInstance.auth.currentUser.getIdToken();
            return token;
        } catch (error) {
            return ErrorHandler.getFireBaseError(error);
        }
    }
}