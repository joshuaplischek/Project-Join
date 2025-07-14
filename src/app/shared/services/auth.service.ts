import { inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import { BehaviorSubject, last } from 'rxjs';
import { AuthData } from '../../../interfaces/authData';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  firestore: Firestore = inject(Firestore);
  firebaseApp: FirebaseApp = inject(FirebaseApp);

  login() {
    this.isLoggedInSubject.next(true);
  }

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
      await updateProfile(userCredential.user, {
        displayName: `${authData.firstName} ${authData.lastName}`,
      });

      await setDoc(
        doc(this.firestore, 'contactlist', userCredential.user.uid),
        {
          firstName: authData.firstName,
          lastName: authData.lastName,
        }
      );

      this.isLoggedInSubject.next(true);
      return userCredential;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  }
}
