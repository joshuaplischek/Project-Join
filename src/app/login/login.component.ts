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

  loginHeading = 'Log in';
  loginButtonText = 'Log in';

  registerHeading = 'Sign up';
  registerButtonText = 'Sign up';

  wrongUser: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

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
      this.authService.logIn(authData);
      this.router.navigate(['/summary']);
    } catch {
      this.wrongUser = true;
    }
  }
}
