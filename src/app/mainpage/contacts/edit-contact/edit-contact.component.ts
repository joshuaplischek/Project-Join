import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactformComponent } from "../contactform/contactform.component";
import { CommonModule } from '@angular/common';
import { Contactlist } from '../../../contactlist';

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

  close() {
    this.closeModal.emit();
  }

  deleteContact() {
    console.log('Delete contact:', this.selectedContact);
    this.close();
  }

  saveContact() {
    console.log('Save contact:', this.selectedContact);
    this.close();
  }
}
