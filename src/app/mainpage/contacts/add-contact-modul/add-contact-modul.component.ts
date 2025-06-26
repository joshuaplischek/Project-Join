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

@Component({
  selector: 'app-add-contact-modul',
  standalone: true,
  imports: [ContactformComponent, CommonModule],
  templateUrl: './add-contact-modul.component.html',
  styleUrl: './add-contact-modul.component.scss',
})
export class AddContactModulComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() contactCreated = new EventEmitter<Contactlist>();
  @ViewChild(ContactformComponent) contactFormComponent?: ContactformComponent;

  createContact(formData: Contactlist) {
    this.contactCreated.emit(formData);
    this.close();
  }

  close() {
    this.contactFormComponent?.resetForm();
    this.closeModal.emit();
  }
}
