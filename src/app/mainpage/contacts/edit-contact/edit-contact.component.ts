import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ContactformComponent } from '../contactform/contactform.component';
import { CommonModule } from '@angular/common';
import { Contactlist } from '../../../../interfaces/contactlist';
import { FirebaseService } from '../../../shared/services/firebase.service';

/**
 * Component for editing and deleting existing contacts.
 */
@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [ContactformComponent, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss',
})
export class EditContactComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedContact: Contactlist | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() contactDeleted = new EventEmitter<void>();
  @Output() contactUpdated = new EventEmitter<void>();

  firebaseService = inject(FirebaseService);

  /**
   * Closes the edit contact modal.
   */
  close() {
    this.closeModal.emit();
  }

  /**
   * Deletes the selected contact from Firebase.
   *
   * @throws {Error} When contact deletion fails
   */
  async deleteContact() {
    if (this.selectedContact?.id) {
      await this.firebaseService.deleteContact(this.selectedContact.id);
      this.contactDeleted.emit();
      this.close();
    }
  }

  /**
   * Saves updated contact data to Firebase.
   *
   * @param formData - Updated contact data from the form
   *
   * @throws {Error} When contact update fails
   */
  async saveContact(formData: Contactlist) {
    if (this.selectedContact?.id) {
      await this.firebaseService.updateContact(
        this.selectedContact.id,
        formData
      );
      this.contactUpdated.emit();
      this.close();
    }
  }
}
