import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ContactformComponent } from "../contactform/contactform.component";
import { CommonModule } from '@angular/common';
import { Contactlist } from '../../../contactlist';
import { FirebaseService } from '../../../shared/services/firebase.service';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [ContactformComponent, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Input() isVisible = false;
  @Input() selectedContact: Contactlist | null = null; 
  @Output() closeModal = new EventEmitter<void>();
  @Output() contactDeleted = new EventEmitter<void>();
  @Output() contactUpdated = new EventEmitter<void>();
  
  firebaseService = inject(FirebaseService);

  close() {
    this.closeModal.emit();
  }

  async deleteContact() {
    if (this.selectedContact?.id) {
      await this.firebaseService.deleteContact(this.selectedContact.id);
      this.contactDeleted.emit();
      this.close();
    }
  }

  async saveContact(formData: Contactlist) {
    if (this.selectedContact?.id) {
      await this.firebaseService.updateContact(this.selectedContact.id, formData);
      this.contactUpdated.emit();
      this.close();
    }
  }
}
