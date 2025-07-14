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

  constructor(private router: Router, private authService: AuthService) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  guestLogin() {
    console.log('Guest login');
    this.authService.login();
    this.router.navigate(['/board']);
  }

  onLogin(authData: AuthData) {
    console.log('Login attempt:', authData);
    this.authService.login();
    this.router.navigate(['/board']);
  }

  onRegister(authData: AuthData) {
    console.log('Register attempt:', authData);
    this.authService.signUp(authData)
    this.authService.login();
    this.router.navigate(['/board']);
  }
    
}
