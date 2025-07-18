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

/**
 * Service for handling user authentication operations.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  firestore: Firestore = inject(Firestore);
  firebaseApp: FirebaseApp = inject(FirebaseApp);
  userExists: boolean = false;
  userSignedUp: boolean = false;
  wrongUserData: boolean = false;
  loginSuccess: boolean = false;
  wasJustLoggedIn: boolean = false;

  private shouldShowSuccessMessage: boolean = false;
  private shouldShowSignOutMessage: boolean = false;
  pendingSignOutMessage: boolean = false;

  /**
   * Logs in a guest user without authentication.
   */
  logInGuest() {
    this.wasJustLoggedIn = true;
    this.isLoggedInSubject.next(true);
  }

  /**
   * Checks and resets the success message flag.
   */
  checkAndResetSuccessMessage(): boolean {
    if (this.shouldShowSuccessMessage) {
      this.shouldShowSuccessMessage = false;
      return true;
    }
    return false;
  }

  /**
   * Checks and resets the sign out message flag.
   */
  checkAndResetSignOutMessage(): boolean {
    if (this.pendingSignOutMessage) {
      this.pendingSignOutMessage = false;
      return this.shouldShowSignOutMessage;
    }
    return this.shouldShowSignOutMessage;
  }

  /**
   * Logs out the current user.
   *
   * @throws {Error} When logout fails
   */
  logout() {
    const auth = getAuth(this.firebaseApp);
    signOut(auth)
      .then(() => {
        this.shouldShowSuccessMessage = false;
        this.shouldShowSignOutMessage = true;
        this.pendingSignOutMessage = true;
        this.isLoggedInSubject.next(false);
      })
      .catch((error) => {
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

  get uId(): string {
    const auth = getAuth(this.firebaseApp);
    return auth.currentUser?.uid || '';
  }

  /**
   * Signs up a new user with email and password.
   *
   * @param authData - User registration data
   *
   * @throws {Error} When signup fails
   */
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

  /**
   * Saves user data to Firestore database.
   *
   * @param authData - User registration data
   * @param userCredential - Firebase user credential
   *
   * @throws {Error} When database save fails
   */
  async saveInDatabase(authData: AuthData, userCredential: UserCredential) {
    await setDoc(doc(this.firestore, 'contactlist', userCredential.user.uid), {
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email,
    });
  }

  /**
   * Logs in an existing user with email and password.
   *
   * @param authData - User login data
   *
   * @throws {Error} When login fails
   */
  async logIn(authData: AuthData) {
    this.userExists = false;
    this.loginSuccess = false;
    this.wasJustLoggedIn = true;
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
