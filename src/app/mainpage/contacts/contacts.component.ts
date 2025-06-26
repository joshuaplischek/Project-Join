import { Component, ViewChild } from '@angular/core';
import { Contactlist } from '../../../interfaces/contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { AddContactModulComponent } from './add-contact-modul/add-contact-modul.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { first } from 'rxjs';
import { Location } from '@angular/common';
import { ContactformComponent } from './contactform/contactform.component';

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
  isMenuOpen: boolean = false;
  openDetail: boolean = false;
  isAddContactFormVisible = false;
  isEditContactFormVisible = false;
  selectedContact: Contactlist | null = null;

  successMessage = '';
  showSuccessMessage = false;
  isMobile: boolean = false;

  constructor(
    private contactlist: FirebaseService,
    private location: Location
  ) {}

  ngOnInit() {
    this.contacts = this.contactlist.contacts;
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  get groupedContacts() {
    const grouped: Record<string, Contactlist[]> = {};

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
    this.showSuccessMessageBox('Kontakt wurde erfolgreich hinzugefügt!');

    setTimeout(() => {
      const newContact = this.contactlist.contacts.find(
        (contact) =>
          contact.email === formData.email &&
          contact.lastName === formData.lastName
      );
      if (newContact) {
        this.selectedContact = newContact;
        this.isOpen = true;
      }
      this.isAddContactFormVisible = false;
    }, 300);
  }

  showSuccessMessageBox(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);
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
    if (this.isMobile) {
      this.isOpen = true;
    }
  }

  async getContactField(id: string) {
    const data = await this.contactlist.getSingleContactOnce(id);
    this.selectedContact = data;
  }

  async deleteContact(contactId?: string) {
    if (!contactId && this.selectedContact?.id) {
      contactId = this.selectedContact.id;
    }

    if (contactId) {
      await this.contactlist.deleteContact(contactId);
      this.selectedContact = null;
      this.isOpen = false;
      this.closeEditContactForm();
    }
  }

  async updateContact() {
    this.showSuccessMessageBox('Kontakt wurde erfolgreich aktualisiert!');
    this.closeEditContactForm();

    if (this.selectedContact?.id) {
      await this.getContactField(this.selectedContact.id);
    }
  }

  openOptionsMenu() {
    this.isMenuOpen = true;
  }

  closeOptionsMenu() {
    this.isMenuOpen = false;
  }

  goBack(): void {
    if (this.isMobile) {
      this.isOpen = false;
      this.selectedContact = null;
    } else {
      this.location.back();
    }
  }
}
