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
  openDetail: boolean = false;
  selectedContact: any = null;
  constructor(private contactlist: FirebaseService) {}

  ngOnInit() {
    this.contacts = this.contactlist.contacts;
  }

  addContact() {}

  openSingleContact(contact: Contactlist) {
    this.isOpen = !this.isOpen;
    if (this.selectedContact?.id === contact.id) return;
    if (!this.isOpen) {
      setTimeout(() => {
        this.getContactField(contact.id);
        this.isOpen = true;
      }, 400);
    }
  }

async getContactField(id: any) {
  const data = await this.contactlist.getSingleContactOnce(id);
  this.selectedContact = data;
}

  

  openEdit() {}

  deleteContact() {}
}
