import { inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { BehaviorSubject, last } from 'rxjs';
import { AuthData } from '../../../interfaces/authData';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FirebaseApp } from '@angular/fire/app';
import { signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  firestore: Firestore = inject(Firestore);
  firebaseApp: FirebaseApp = inject(FirebaseApp);
  userExists: boolean = false;
  userSignedUp: boolean = false;
  wrongUserData: boolean = false;
  loginSuccess: boolean = false;

  private shouldShowSuccessMessage: boolean = false;
  private shouldShowSignOutMessage: boolean = false;

  logInGuest() {
    this.isLoggedInSubject.next(true);
  }

  checkAndResetSuccessMessage(): boolean {
    if (this.shouldShowSuccessMessage) {
      this.shouldShowSuccessMessage = false;
      return true;
    }
    return false;
  }

  checkAndResetSignOutMessage(): boolean {
    if (this.shouldShowSignOutMessage) {
      this.shouldShowSignOutMessage = false;
      console.log(this.shouldShowSignOutMessage);
      return true;
    }
    return false;
  }

  logout() {
    const auth = getAuth(this.firebaseApp);
    signOut(auth)
      .then(() => {
        this.shouldShowSuccessMessage = false;
        this.shouldShowSignOutMessage = true;
        this.isLoggedInSubject.next(false);
      })
      .catch((error) => {
        console.log('Error during sign out:', error);
        this.shouldShowSuccessMessage = false;
        this.shouldShowSignOutMessage = false;
        this.isLoggedInSubject.next(false);
      });
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  get displayName(): string {
    const auth = getAuth(this.firebaseApp);
    return auth.currentUser?.displayName || '';
  }

  async signUp(authData: AuthData) {
    try {
      const auth = getAuth(this.firebaseApp);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        authData.email,
        authData.password
      );
      this.userSignedUp = true;
      await updateProfile(userCredential.user, {
        displayName: `${authData.firstName} ${authData.lastName}`,
      });
      await this.saveInDatabase(authData, userCredential);
      this.shouldShowSuccessMessage = true;
      this.shouldShowSignOutMessage = false;
      this.isLoggedInSubject.next(true);
      return userCredential;
    } catch (error) {
      console.error('Error during sign up:', error);
      this.isLoggedInSubject.next(false);
      throw error;
    }
  }

  async saveInDatabase(authData: AuthData, userCredential: UserCredential) {
    await setDoc(doc(this.firestore, 'contactlist', userCredential.user.uid), {
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email,
    });
  }

  async logIn(authData: AuthData) {
    this.userExists = false;
    this.loginSuccess = false;
    try {
      const auth = getAuth(this.firebaseApp);
      const userLogIn = await signInWithEmailAndPassword(
        auth,
        authData.email,
        authData.password
      );
      this.loginSuccess = true;
      this.userExists = true;
      this.shouldShowSuccessMessage = true;
      this.shouldShowSignOutMessage = false;
      this.isLoggedInSubject.next(true);
      return userLogIn;
    } catch (error) {
      this.userExists = false;
      this.loginSuccess = false;
      this.isLoggedInSubject.next(false);
      console.error('Error during Log In:', error);
      throw error;
    }
  }
}
