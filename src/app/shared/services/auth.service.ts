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
import { signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  firestore: Firestore = inject(Firestore);
  firebaseApp: FirebaseApp = inject(FirebaseApp);

  login() {}

  logout() {
    this.isLoggedInSubject.next(false);
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
      await updateProfile(userCredential.user, {
        displayName: `${authData.firstName} ${authData.lastName}`,
      });

      this.saveInDatabase(authData, userCredential);

      this.isLoggedInSubject.next(true);
      return userCredential;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  }

  async saveInDatabase(authData: AuthData, userCredential: UserCredential) {
    await setDoc(doc(this.firestore, 'contactlist', userCredential.user.uid), {
      firstName: authData.firstName,
      lastName: authData.lastName,
    });
  }

  logIn(authData: AuthData) {
    try {
      const auth = getAuth(this.firebaseApp);
      const userLogIn = signInWithEmailAndPassword(auth, authData.email, authData.password);
      console.log(userLogIn);
      
      this.isLoggedInSubject.next(true);
    } catch (error) {
      console.error('Error during Log In:', error);
      throw error;
    }
  }
}
