import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LogFormComponent } from '../shared/log-form/log-form.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthData } from '../../interfaces/authData';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogFormComponent, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoginMode = true; // true = Login, false = Register

  loginHeading: string = 'Log in';
  loginButtonText: string = 'Log in';

  registerHeading: string = 'Sign up';
  registerButtonText: string = 'Sign up';

  loginSuccess: boolean = false;
  wrongUser: boolean = false;

  showSignOutMessage: boolean = false;
  signOutMessage: string = '';
  animationStarted: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.startAnimations();
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      // Wenn ausgeloggt, zeige die Nachricht und stoße Change Detection an
      if (!loggedIn && !this.showSignOutMessage) {
        this.showSignOutMessage =
        this.authService.checkAndResetSignOutMessage();
        this.cdr.detectChanges();
      }
    });
  }

  startAnimations() {
    setTimeout(() => {
      this.animationStarted = true;
    }, 10);

    setTimeout(() => {
      this.animationStarted = false;
    }, 1500);
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  guestLogin() {
    this.authService.logInGuest();
    this.router.navigate(['/summary']);
  }

  async onLogin(authData: AuthData) {
    try {
      await this.authService.logIn(authData);
      this.router.navigate(['/summary']);
    } catch {
      this.wrongUser = true;
    }
  }

  async onRegister(authData: AuthData) {
    try {
      await this.authService.signUp(authData);
      this.router.navigate(['/summary']);
    } catch {
      this.wrongUser = true;
    }
  }
}
