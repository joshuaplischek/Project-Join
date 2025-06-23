import { Component } from '@angular/core';
import { Contactlist } from '../../contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { TestComponent } from '../../test/test.component';
import { AddContactModulComponent } from './add-contact-modul/add-contact-modul.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, AddContactModulComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {

  readonly standardColors: string[] = [
  '#ff7a00',  
  '#1fd7c1',  
  '#6e52ff',  
  '#9327ff',  
  '#ffbb2b',  
  '#fc71ff',  
  '#ff4646',  
  '#3F51B5',  
  '#462f8a',
];

  contacts: Contactlist[] = [];
  isOpen: boolean = false;
  openDetail: boolean = false;
  selectedContact: any = null;
  constructor(private contactlist: FirebaseService) {}

  ngOnInit() {
    this.contacts = this.contactlist.contacts;
  }

  get groupedContacts() {
    const grouped: Record<string, Contactlist[]> = {};

    // Wichtig! this.contactlist.contacts nutzen - damit erhält man immer die aktuellsten Daten
    for (const contact of this.contactlist.contacts) {
      if (contact.firstName && contact.firstName.length > 0) {
        const letter = contact.firstName[0].toUpperCase();
        grouped[letter] ??= [];
        grouped[letter].push(contact);
      }
    }

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({ letter, contacts: grouped[letter] }));
  }

  getRandomHslColor(): string {
    const index = Math.floor(Math.random() * this.standardColors.length);
    return this.standardColors[index];
  }

  openAddContactForm() {
    this.isAddContactFormVisible = true;
  }

  addContactToDb(formData: Contactlist) {
    this.contactlist.addContact(formData);
  }

  closeAddContactForm() {
    this.isAddContactFormVisible = false;
  }

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
