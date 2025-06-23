import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contactlist } from '../../../contactlist';

@Component({
  selector: 'app-contactform',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactform.component.html',
  styleUrl: './contactform.component.scss'
})
export class ContactformComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  clicked = false;
  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  phoneTouched = false;

  constructor(private contactService: FirebaseService) { }

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';
  @Input() contactData: Contactlist | null = null;

  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<Contactlist>();

  ngOnChanges() {
    if (this.contactData) {
      this.firstName = this.contactData.firstName;
      this.lastName = this.contactData.lastName;
      this.email = this.contactData.email;
      this.phone = this.contactData.phone;
    } else {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.phone = '';
    }
  }

  isValidEmail(): boolean {
    return this.email.includes('@');
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.emailTouched = false;
    this.phoneTouched = false;
  }

  close() {
    this.resetForm();
    this.closeModal.emit();
  }
}
