import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contactlist } from '../../../../interfaces/contactlist';

/**
 * Component for creating and editing contact forms.
 */
@Component({
  selector: 'app-contactform',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactform.component.html',
  styleUrl: './contactform.component.scss',
})
export class ContactformComponent implements OnChanges {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  clicked: boolean = false;
  firstNameTouched: boolean = false;
  lastNameTouched: boolean = false;
  emailTouched: boolean = false;
  phoneTouched: boolean = false;

  /**
   * @param contactService - Service for contact operations
   */
  constructor(private contactService: FirebaseService) {}

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';
  @Input() contactData: Contactlist | null = null;

  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<Contactlist>();

  /**
   * Handles changes to input properties and updates form data.
   */
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

  /**
   * Validates email format by checking for @ symbol.
   */
  isValidEmail(): boolean {
    return this.email.includes('@');
  }

  /**
   * Resets all form fields and validation states.
   */
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

  /**
   * Closes the form modal and resets all fields.
   */
  close() {
    this.resetForm();
    this.closeModal.emit();
  }
}
