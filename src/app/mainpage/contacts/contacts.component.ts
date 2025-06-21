import { Component } from '@angular/core';
import { Contactlist } from '../../contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contacts: Contactlist[] = [];
  isOpen: boolean = false;
  selectedContact: any = null;
  constructor(private contactlist: FirebaseService) {}

  ngOnInit() {
    this.contacts = this.contactlist.contacts;
  }

  addContact() {}

  openSingleContact() {
    this.isOpen = !this.isOpen;
  }

  getContactField(id: any) {
    this.contactlist.subSingleContact(id, (data) => {
      this.selectedContact = data;
    });
  }

  openEdit() {}

  deleteContact() {}
}
