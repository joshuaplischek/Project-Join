import { inject, Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { BehaviorSubject, last } from 'rxjs';
import { AuthData } from '../../../interfaces/authData';
import { user } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  firestore: Firestore = inject(Firestore);

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
    const auth = getAuth();
    try {
  const userCredential = createUserWithEmailAndPassword(auth, authData.email, authData.password)
    await updateProfile((await userCredential).user, {
      displayName: `${authData.firstName} ${authData.lastName}`,
    });

    await setDoc(doc(this.firestore, 'contactlist', (await userCredential).user.uid), {
      firstName: authData.firstName,
      lastName: authData.lastName,
    });

    this.isLoggedInSubject.next(true);
    return userCredential; 
  } catch (error) {
      console.error('Error during sign up:', error);
      throw error; // Rethrow the error to handle it in the component
    }

  }

 

  constructor() {}
}
