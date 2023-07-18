import * as firebase from 'firebase/app'
import {
  DocumentData,
  Firestore,
  Query,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  Unsubscribe,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from 'firebase/firestore'

import { FirebaseUser } from './firebase-user'

export class Firebase {
  public user: FirebaseUser

  private static readonly App = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  })

  public readonly firestore: Firestore

  constructor() {
    this.firestore = getFirestore(Firebase.App)
    this.user = new FirebaseUser(this.firestore, Firebase.App)
  }

  public onInit() {
    return this.user.onInit()
  }

  public query(collectionName: string, constraint: QueryFieldFilterConstraint) {
    const q = query(collection(this.firestore, collectionName), constraint)

    return this.promisefyOnSnapshot(q)
  }

  public getDocs(collectionName: string, constraints: QueryFieldFilterConstraint[]) {
    const q = query(collection(this.firestore, collectionName), ...constraints)

    return getDocs(q)
  }

  private promisefyOnSnapshot = (q: Query<DocumentData>) => {
    let unsub: Unsubscribe

    const promise = new Promise<QuerySnapshot<DocumentData>>(
      (resolve) => (unsub = onSnapshot(q, (snapshot) => resolve(snapshot))),
    )

    return { promise, unsubscribe: () => unsub() }
  }
}
