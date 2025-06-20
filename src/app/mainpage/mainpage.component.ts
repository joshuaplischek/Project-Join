import { Component } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { ContactsComponent } from "./contacts/contacts.component";

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [ContactsComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {




}
