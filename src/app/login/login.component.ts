import { Component } from '@angular/core';
import { LogFormComponent } from '../shared/log-form/log-form.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthData } from '../../interfaces/authData';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogFormComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode = true; // true = Login, false = Register

  loginHeading = 'Log in';
  loginButtonText = 'Log in';

  registerHeading = 'Sign up';
  registerButtonText = 'Sign up';

  constructor(private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  guestLogin() {
    console.log('Guest login');
    this.router.navigate(['/board']);
  }

  onLogin(authData: AuthData) {
    console.log('Login attempt:', authData);
    this.router.navigate(['/board']);
  }

  onRegister(authData: AuthData) {
    console.log('Register attempt:', authData);
  }
}
