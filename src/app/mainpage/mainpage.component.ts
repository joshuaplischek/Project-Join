import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { NavComponent } from "../shared/nav/nav.component";
import { QuickMenuComponent } from "../shared/quick-menu/quick-menu.component";
import { FirebaseService } from '../shared/services/firebase.service';
import { Contactlist } from '../contactlist';
import { ContactsComponent } from "./contacts/contacts.component";

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [HeaderComponent, NavComponent, QuickMenuComponent, ContactsComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {




}
