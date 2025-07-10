import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contactlist } from '../../../interfaces/contactlist';

import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthData } from '../../../interfaces/authData';

@Component({
  selector: 'app-log-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private contactService: FirebaseService) {}

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';

  @Input() isVisible = true;
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<AuthData>();

  @Input() isLoginMode = false;
  @Input() showPasswordConfirm = true;
  @Input() showNameFields = true;

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
      const nameValid = this.showNameFields
        ? this.firstName.trim().length > 0 && this.lastName.trim().length > 0
        : true;
      const confirmPasswordValid = this.showPasswordConfirm
        ? this.confirmedPassword.trim().length > 0
        : true;
      return emailValid && passwordValid && nameValid && confirmPasswordValid;
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
