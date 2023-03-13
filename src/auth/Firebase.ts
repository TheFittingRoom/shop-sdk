import * as firebase from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

class Firebase {
	static apiKey: string;
	static authDomain: string;
	static projectId: string;
	static storageBucket: string;
	static messagingSenderId: string;
	static appID: string;

	public static App: firebase.FirebaseApp;
	public static Auth: firebaseAuth.Auth;
	public static Firestore: Firestore;

	static Init(apiKey:string, authDomain:string, projectId:string, storageBucket:string, messagingSenderId:string, appId:string) {
		this.apiKey = apiKey;
		this.authDomain = authDomain;
		this.projectId = projectId;
		this.storageBucket = storageBucket;
		this.messagingSenderId = messagingSenderId;
		this.appID = appId;

		if (!this.App) {
			this.App = firebase.initializeApp({
				apiKey: this.apiKey,
				authDomain: this.authDomain,
				projectId: this.projectId,
				storageBucket: this.storageBucket,
				messagingSenderId: this.messagingSenderId,
				appId: this.appID
			});

			this.Auth = firebaseAuth.getAuth(this.App)
			this.Firestore = getFirestore(this.App);
		}
	}


	// this not belong here even though its related to firebase, its not really static
/* 	static GetJWT() {
		if (!this.firebaseAuthInstance) {
			throw new Error("Firebase not initialized");
		}
		return this.firebaseAuthInstance.currentUser.getIdToken();
	} */
}

export {Firebase};

