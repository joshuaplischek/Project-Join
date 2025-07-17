import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LogFormComponent } from '../shared/log-form/log-form.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthData } from '../../interfaces/authData';
import { AuthService } from '../shared/services/auth.service';

/**
 * Component for user login and registration functionality.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogFormComponent, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoginMode: boolean = true;

  loginHeading: string = 'Log in';
  loginButtonText: string = 'Log in';

  registerHeading: string = 'Sign up';
  registerButtonText: string = 'Sign up';

  loginSuccess: boolean = false;
  wrongUser: boolean = false;

  showSignOutMessage: boolean = false;
  signOutMessage: string = '';
  animationStarted: boolean = false;

  /**
   * @param router - Angular router for navigation
   * @param authService - Service for authentication operations
   * @param cdr - Change detector for manual change detection
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Initializes component and sets up animations and subscriptions.
   */
  ngOnInit() {
    this.startAnimations();
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      if (!loggedIn && !this.showSignOutMessage) {
        this.showSignOutMessage =
          this.authService.checkAndResetSignOutMessage();
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Starts logo animation sequence.
   */
  startAnimations() {
    setTimeout(() => {
      this.animationStarted = true;
    }, 10);

    setTimeout(() => {
      this.animationStarted = false;
    }, 1500);
  }

  /**
   * Toggles between login and registration mode.
   */
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  /**
   * Logs in user as guest and navigates to summary page.
   */
  guestLogin() {
    this.authService.logInGuest();
    this.router.navigate(['/summary']);
  }

  /**
   * Handles user login with authentication data.
   *
   * @param authData - User login credentials
   *
   * @throws {Error} When login fails
   */
  async onLogin(authData: AuthData) {
    try {
      await this.authService.logIn(authData);
      this.router.navigate(['/summary']);
    } catch {
      this.wrongUser = true;
    }
  }

  /**
   * Handles user registration with authentication data.
   *
   * @param authData - User registration data
   *
   * @throws {Error} When registration fails
   */
  async onRegister(authData: AuthData) {
    try {
      await this.authService.signUp(authData);
      this.router.navigate(['/summary']);
    } catch {
      this.wrongUser = true;
    }
  }
}
