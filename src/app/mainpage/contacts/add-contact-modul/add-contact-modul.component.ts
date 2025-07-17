import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ContactformComponent } from '../contactform/contactform.component';
import { CommonModule } from '@angular/common';
import { Contactlist } from '../../../../interfaces/contactlist';

/**
 * Component for adding new contacts via modal interface.
 */
@Component({
  selector: 'app-add-contact-modul',
  standalone: true,
  imports: [ContactformComponent, CommonModule],
  templateUrl: './add-contact-modul.component.html',
  styleUrl: './add-contact-modul.component.scss',
})
export class AddContactModulComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() contactCreated = new EventEmitter<Contactlist>();
  @ViewChild(ContactformComponent) contactFormComponent?: ContactformComponent;

  /**
   * Creates a new contact and emits the contact data.
   *
   * @param formData - Contact data from the form
   */
  createContact(formData: Contactlist) {
    this.contactCreated.emit(formData);
    this.close();
  }

  /**
   * Closes the modal and resets the form.
   */
  close() {
    this.contactFormComponent?.resetForm();
    this.closeModal.emit();
  }
}
