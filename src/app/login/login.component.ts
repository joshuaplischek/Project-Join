import { Component } from '@angular/core';
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
  wrongUserData = false;
  userExistsErrMessage = false;

  loginHeading = 'Log in';
  loginButtonText = 'Log in';

  registerHeading = 'Sign up';
  registerButtonText = 'Sign up';

  constructor(private router: Router, private authService: AuthService) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  guestLogin() {
    this.authService.login();
    this.router.navigate(['/summary']);
  }

  onLogin(authData: AuthData) {
    this.authService.logIn(authData);
    if (this.authService.userExists) {
      this.router.navigate(['/summary']);
    } else {
      this.wrongUserData = true;
    }
  }

  onRegister(authData: AuthData) {
    this.authService.signUp(authData);
    if (this.authService.userSignedUp) {
      this.authService.login();
      this.router.navigate(['/summary']);
    } else {
      this.userExistsErrMessage = true;
    }
  }
}
