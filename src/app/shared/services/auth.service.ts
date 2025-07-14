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

  login() {}

  logout() {
    const auth = getAuth(this.firebaseApp);
    signOut(auth)
      .then(() => {
        this.isLoggedInSubject.next(false);
      })
      .catch((error) => {
        console.log('Error during sign out:', error);
      });
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  async signUp(authData: AuthData) {
    try {
      const auth = getAuth(this.firebaseApp);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        authData.email,
        authData.password
      );
      console.log(userCredential);
      this.userSignedUp = true;
      await updateProfile(userCredential.user, {
        displayName: `${authData.firstName} ${authData.lastName}`,
      });

      this.saveInDatabase(authData, userCredential);

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
    });
  }

  async logIn(authData: AuthData) {
    try {
      const auth = getAuth(this.firebaseApp);
      const userLogIn = await signInWithEmailAndPassword(
        auth,
        authData.email,
        authData.password
      );
      this.userExists = true;
      console.log(userLogIn);

      this.isLoggedInSubject.next(true);
    } catch (error) {
      console.error('Error during Log In:', error);
      this.isLoggedInSubject.next(false);
      throw error;
    }
  }
}
