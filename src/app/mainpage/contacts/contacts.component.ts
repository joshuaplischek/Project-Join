import { Component } from '@angular/core';
import { Contactlist } from '../../contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { TestComponent } from '../../test/test.component';
import { AddContactModulComponent } from "./add-contact-modul/add-contact-modul.component";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, AddContactModulComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contacts: Contactlist[] = [];
  isOpen: boolean = false;
  isAddContactFormVisible = false;

  constructor(private contactlist: FirebaseService) { }

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
      .map(letter => ({ letter, contacts: grouped[letter] }));
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

  openSingleContact() {
    this.isOpen = !this.isOpen;
  }

  openEdit() { }

  deleteContact() { }
}
