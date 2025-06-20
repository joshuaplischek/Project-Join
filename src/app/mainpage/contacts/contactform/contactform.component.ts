import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contactform.component.html',
  styleUrl: './contactform.component.scss'
})
export class ContactformComponent {

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

  close() {
    this.closeModal.emit();
  }
}
