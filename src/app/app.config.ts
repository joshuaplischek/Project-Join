import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()), provideFirebaseApp(() => initializeApp({"projectId":"project-join-afa57","appId":"1:1028088814116:web:8de8a56a624b5bea5456b1","storageBucket":"project-join-afa57.firebasestorage.app","apiKey":"AIzaSyDJNjXVhs_d-kLDnVQxg7NNteOjtnwBKas","authDomain":"project-join-afa57.firebaseapp.com","messagingSenderId":"1028088814116"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideAnimationsAsync()]
};
