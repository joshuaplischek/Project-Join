import { Component, Input } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';

@Component({
  selector: 'app-contactform',
  standalone: true,
  imports: [],
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
}
