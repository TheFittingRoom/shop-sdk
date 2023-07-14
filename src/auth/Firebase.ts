import * as firebase from 'firebase/app'
import { FirebaseError } from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import { AuthErrorCodes } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { DocumentData, DocumentSnapshot, doc, getDoc } from 'firebase/firestore'

import { UIError, createUIError } from '../api/UIError'
import * as types from '../types'

function GetFirebaseUIError(e: FirebaseError): UIError {
  switch (e.code) {
    case AuthErrorCodes.INVALID_EMAIL:
    case AuthErrorCodes.INVALID_PASSWORD:
    case AuthErrorCodes.USER_DELETED:
      return createUIError('Your email or password is incorrect', new Error(e.message))
    case AuthErrorCodes.USER_DISABLED:
      return createUIError('Your account has been disabled')
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return createUIError('Too many failed login attempts. Please try again later', new Error(e.message))
    case AuthErrorCodes.OPERATION_NOT_ALLOWED:
      return createUIError('This sign-in provider is disabled', new Error(e.message))
    default:
      return createUIError('An unknown error has occurred', new Error(e.message))
  }
}

const InitFirebaseUser = (firebase: types.Firebase, User: firebaseAuth.User): types.FirebaseUser => {
  const notLoggedIn = (reject): boolean => {
    if (User == null || !User.uid) {
      console.error('checkLoggedIn failed; rejecting with NotLoggedIn')
      reject(types.NotLoggedIn)
      return true
    }
    return false
  }

  const ID = () => {
    return User?.uid
  }

  const Token = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (notLoggedIn(reject)) return
      User.getIdToken()
        .then((token) => {
          resolve(token)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  const GetUserProfile = () => {
    return new Promise((resolve, reject) => {
      if (notLoggedIn(reject)) return
      getDoc(doc(firebase.Firestore, 'users', ID()))
        .then((documentSnapshot: DocumentSnapshot<DocumentData>) => {
          resolve(documentSnapshot.data())
        })
        .catch((error) => {
          if (error == types.NotLoggedIn) {
            reject(error)
            return
          }
          reject(GetFirebaseUIError(error))
        })
    })
  }

  const SignOut = () => {
    return new Promise<void>((resolve, reject) => {
      firebaseAuth
        .signOut(firebase.Auth)
        .then(async () => {
          console.debug('signout successful')
          User = null
          resolve()
        })
        .catch((error) => {
          console.error('failed to sign out user', error)
          reject(error)
        })
    })
  }

  return {
    Firebase: firebase,
    ID,
    Token,
    GetUserProfile,
    SignOut,
  }
}

const InitFirebase = (): types.FirebaseInstance => {
  const App = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  })

  const Auth = firebaseAuth.getAuth(App)
  Auth.setPersistence(firebaseAuth.browserLocalPersistence)
  const Firestore = getFirestore(App)

  const instance = {
    App,
    Auth,
    Firestore,
  }

  const SendPasswordResetEmail = (email: string) => {
    return new Promise<void>((resolve, reject) => {
      firebaseAuth
        .sendPasswordResetEmail(Auth, email)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(GetFirebaseUIError(error))
        })
    })
  }

  const ConfirmPasswordReset = (code: string, newPassword: string) => {
    return new Promise<void>((resolve, reject) => {
      firebaseAuth
        .confirmPasswordReset(Auth, code, newPassword)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(GetFirebaseUIError(error))
        })
    })
  }

  // Checks if a firestore user exists in local storage
  const User = (): Promise<types.FirebaseUser> => {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebaseAuth.onAuthStateChanged(Auth, async (user) => {
        if (user) {
          unsubscribe()
          resolve(InitFirebaseUser(instance, user))
        } else {
          unsubscribe()
          reject(types.NotLoggedIn)
        }
      })
    })
  }

  const Login = (username, password: string): Promise<types.FirebaseUser> => {
    return new Promise((resolve, reject) => {
      const auth = firebaseAuth.getAuth(App)
      auth.signOut().finally(() => {
        firebaseAuth
          .signInWithEmailAndPassword(Auth, username, password)
          .then((userCredential) => {
            resolve(InitFirebaseUser(instance, userCredential.user))
          })
          .catch((error) => {
            reject(GetFirebaseUIError(error))
          })
      })
    })
  }

  return {
    Firebase: instance,
    SendPasswordResetEmail,
    ConfirmPasswordReset,
    Login,
    User,
  }
}

export { InitFirebase, InitFirebaseUser, GetFirebaseUIError }
