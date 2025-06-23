import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  phone: number = 0;

  constructor(private contactService: FirebaseService) { }

  callServiceMethode() {
    this.contactService.sortContacts();
  }

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';

  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<{ firstName: string; lastName: string; email: string; phone: number }>();

  close() {
    this.closeModal.emit();
  }
}
