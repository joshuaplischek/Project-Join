import { Component, OnInit } from '@angular/core';
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
export class LoginComponent {
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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.startAnimations();
  }

  startAnimations(){
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

  public checkAndResetSignOutMessage(): boolean {
    return this.authService.checkAndResetSignOutMessage();
  }
}
