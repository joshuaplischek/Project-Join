import { Component } from '@angular/core';
import { Contactlist } from '../../contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { AddContactModulComponent } from './add-contact-modul/add-contact-modul.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { first } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, AddContactModulComponent, EditContactComponent],
  templateUrl: './contacts.component.html',
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
  isAddContactFormVisible = false;
  isEditContactFormVisible = false;
  selectedContact: Contactlist | null = null;

  toastMessage = '';
  showToast = false;

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
      .map((letter) => ({ letter, contacts: grouped[letter] }));
  }

  getColorForLetter(letter: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const index = alphabet.indexOf(letter.toUpperCase());
    if (index === -1) return this.standardColors[0];
    return this.standardColors[index % this.standardColors.length];
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

  openEdit() {
    this.isEditContactFormVisible = true;
  }

  closeEditContactForm() {
    this.isEditContactFormVisible = false;
  }

  openSingleContact(contact: Contactlist) {
    if (this.selectedContact && contact.id !== this.selectedContact.id) {
      this.isOpen = false;
      setTimeout(() => {
        this.selectedContact = contact;
        this.isOpen = true;
      }, 300);
    } else {
      this.selectedContact = contact;
      this.isOpen = true;
    }
  }

  async getContactField(id: any) {
    const data = await this.contactlist.getSingleContactOnce(id);
    this.selectedContact = data;
  }

  deleteContact() { }

  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 1000);
  }
}
