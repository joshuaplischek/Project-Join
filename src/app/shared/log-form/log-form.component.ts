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

  clicked = false;
  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  passwordTouched = false;
  confirmedPasswordTouched = false;

  acceptPrivacyPolicy = false;
  acceptPrivacyPolicyTouched = false;

  constructor(private contactService: FirebaseService) {}

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';

  @Input() isVisible = true;
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<AuthData>();
  @Output() backButtonClick = new EventEmitter<void>();

  @Input() isLoginMode = false;
  @Input() showPasswordConfirm = true;
  @Input() showNameFields = true;
  @Input() showBackButton = false;
  @Input() showCheckBoxPrivacyPolicy = false;

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

      // Privacy Policy Validierung hinzufügen
      let privacyPolicyValid: boolean;
      if (this.showCheckBoxPrivacyPolicy) {
        privacyPolicyValid = this.acceptPrivacyPolicy;
      } else {
        privacyPolicyValid = true;
      }

      return (
        emailValid &&
        passwordValid &&
        nameValid &&
        confirmPasswordValid &&
        privacyPolicyValid
      );
    }
  }

  // AuthData Objekt Erstellung
  onSubmit() {
    if (this.isFormValid()) {
      const authData: AuthData = {
        email: this.email,
        password: this.password,
      };

      // Bei Registierung Vor-und Nachnamen hinzufügen
      if (!this.isLoginMode && this.showNameFields) {
        authData.firstName = this.firstName;
        authData.lastName = this.lastName;
      }

      // Passwort Confirmed hinzufügen
      if (this.showPasswordConfirm) {
        authData.confirmedPassword = this.confirmedPassword;
      }

      this.buttonTwoClick.emit(authData);
    }
  }
}
