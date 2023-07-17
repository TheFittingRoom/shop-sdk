import * as firebase from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'
import { Firestore, doc, getDoc } from 'firebase/firestore'

import * as Errors from '../helpers/errors'

export class FirebaseUser {
  private user: firebaseAuth.User
  private readonly auth: firebaseAuth.Auth

  constructor(private readonly firestore: Firestore, app: firebase.FirebaseApp) {
    this.auth = firebaseAuth.getAuth(app)
    this.auth.setPersistence(firebaseAuth.browserLocalPersistence)
  }

  public get id() {
    return this.user?.uid
  }

  public onInit() {
    return new Promise<void>((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        this.setUser(user)
        if (user) return resolve()

        throw new Errors.UserNotLoggedInError()
      })
    })
  }

  public setUser(user: firebaseAuth.User) {
    this.user = user
  }

  public async getToken() {
    if (!this.user?.uid) throw new Errors.UserNotLoggedInError()

    const token = await this.user.getIdToken()

    return token
  }

  public async getUserProfile() {
    if (!this.user?.uid) throw new Errors.UserNotLoggedInError()

    const userProfile = await getDoc(doc(this.firestore, 'users', this.id))

    return userProfile.data()
  }

  public async login(username: string, password: string) {
    if (this.auth.currentUser) await this.auth.signOut()

    const user = await firebaseAuth.signInWithEmailAndPassword(this.auth, username, password)
    this.setUser(user.user)
  }

  public async logout() {
    await this.auth.signOut()
    this.setUser(null)
  }

  public async sendPasswordResetEmail(email: string) {
    await firebaseAuth.sendPasswordResetEmail(this.auth, email)
  }

  public async confirmPasswordReset(code: string, newPassword: string) {
    await firebaseAuth.confirmPasswordReset(this.auth, code, newPassword)
  }
}
