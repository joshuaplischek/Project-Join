import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthData } from '../../../interfaces/authData';

@Component({
  selector: 'app-log-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-form.component.html',
  styleUrl: './log-form.component.scss',
})
export class LogFormComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmedPassword: string = '';

  clicked: boolean = false;
  firstNameTouched: boolean = false;
  lastNameTouched: boolean = false;
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  confirmedPasswordTouched: boolean = false;

  acceptPrivacyPolicy: boolean = false;
  acceptPrivacyPolicyTouched: boolean = false;

  constructor(private contactService: FirebaseService) {}

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';

  @Input() isVisible: boolean = true;
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<AuthData>();
  @Output() backButtonClick = new EventEmitter<void>();

  @Input() isLoginMode: boolean = false;
  @Input() showPasswordConfirm: boolean = true;
  @Input() showNameFields: boolean = true;
  @Input() showBackButton: boolean = false;
  @Input() showCheckBoxPrivacyPolicy: boolean = false;

  isValidEmail(): boolean {
    return this.email.includes('@');
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmedPassword = '';
    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.emailTouched = false;
    this.passwordTouched = false;
    this.confirmedPasswordTouched = false;
  }

  close() {
    this.resetForm();
    this.closeModal.emit();
  }

  isFormValid(): boolean {
    const emailValid = this.email.trim().length > 0 && this.isValidEmail();
    const passwordValid = this.password.trim().length > 0;

    if (this.isLoginMode) {
      return emailValid && passwordValid;
    } else {
      let nameValid: boolean;
      if (this.showNameFields) {
        nameValid =
          this.firstName.trim().length > 0 && this.lastName.trim().length > 0;
      } else {
        nameValid = true;
      }

      let confirmPasswordValid: boolean;
      if (this.showPasswordConfirm) {
        confirmPasswordValid = this.confirmedPassword.trim().length > 0;
      } else {
        confirmPasswordValid = true;
      }
      return emailValid && passwordValid && nameValid && confirmPasswordValid;
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      const authData: AuthData = {
        email: this.email,
        password: this.password,
        firstName: '',
        lastName: '',
        confirmedPassword: '',
      };
      if (!this.isLoginMode && this.showNameFields) {
        authData.firstName = this.firstName;
        authData.lastName = this.lastName;
      }
      if (this.showPasswordConfirm) {
        authData.confirmedPassword = this.confirmedPassword;
      }
      this.buttonTwoClick.emit(authData);
    }
  }
}
