import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactformComponent } from "../contactform/contactform.component";
import { CommonModule } from '@angular/common';
import { Contactlist } from '../../../contactlist';

@Component({
  selector: 'app-add-contact-modul',
  standalone: true,
  imports: [ContactformComponent, CommonModule],
  templateUrl: './add-contact-modul.component.html',
  styleUrl: './add-contact-modul.component.scss'
})
export class AddContactModulComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() contactCreated = new EventEmitter<Contactlist>();

  createContact(formData: Contactlist) {
    this.contactCreated.emit(formData);
    this.close();
  }

  close() {
    this.closeModal.emit();
  }

}
