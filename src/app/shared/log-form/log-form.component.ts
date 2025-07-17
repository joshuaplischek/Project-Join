import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthData } from '../../../interfaces/authData';

/**
 * Component for handling login and registration forms.
 */
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

  passwordHasContent: boolean = false;
  confirmedPasswordHasContent: boolean = false;

  /**
   * @param contactService - Service for Firebase operations
   */
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

  /**
   * Validates email format by checking for @ symbol.
   */
  isValidEmail(): boolean {
    return this.email.includes('@');
  }

  /**
   * Updates password content state on input.
   */
  onPasswordInput() {
    this.passwordHasContent = this.password.length > 0;
  }

  /**
   * Updates confirmed password content state on input.
   */
  onConfirmedPasswordInput() {
    this.confirmedPasswordHasContent = this.confirmedPassword.length > 0;
  }

  /**
   * Resets all form fields and validation states.
   */
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
    this.passwordHasContent = false;
    this.confirmedPasswordHasContent = false;
  }

  /**
   * Closes the form modal and resets all fields.
   */
  close() {
    this.resetForm();
    this.closeModal.emit();
  }

  /**
   * Validates the entire form based on current mode.
   */
  isFormValid(): boolean {
    const emailValid = this.email.trim().length > 0 && this.isValidEmail();
    const passwordValid = this.validatePassword();
    const confirmPasswordValid = this.matchingPasswords();

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
      return (
        emailValid &&
        passwordValid &&
        nameValid &&
        confirmPasswordValid &&
        this.acceptPrivacyPolicy
      );
    }
  }

  /**
   * Checks if password and confirmed password match.
   */
  matchingPasswords(): boolean {
    return this.password === this.confirmedPassword;
  }

  /**
   * Validates password against security requirements.
   *
   * @param password - Password string to validate
   */
  validatePasswordObject(password: string) {
    return {
      isValid:
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password),
      containsLowercaseLetter: /[a-z]/.test(password),
      containsUppercaseLetter: /[A-Z]/.test(password),
      containsDigit: /[0-9]/.test(password),
      containsSpecialCharacter: /[^A-Za-z0-9]/.test(password),
      minLengthMet: password.length >= 8,
    };
  }

  /**
   * Validates current password against all security requirements.
   */
  validatePassword(): boolean {
    const passwordValid = this.validatePasswordObject(this.password);
    if (!passwordValid.isValid) {
      if (!passwordValid.containsLowercaseLetter) return false;
      if (!passwordValid.containsUppercaseLetter) return false;
      if (!passwordValid.containsDigit) return false;
      if (!passwordValid.containsSpecialCharacter) return false;
      if (!passwordValid.minLengthMet) return false;
    }
    return true;
  }

  /**
   * Handles form submission and emits auth data.
   */
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
