import { Component, OnInit, ViewChild } from '@angular/core';
import { Contactlist } from '../../../interfaces/contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { AddContactModulComponent } from './add-contact-modul/add-contact-modul.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { first } from 'rxjs';
import { Location } from '@angular/common';
import { ContactformComponent } from './contactform/contactform.component';
import { AuthService } from '../../shared/services/auth.service';

/**
 * Component for managing contacts with CRUD operations.
 */
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, AddContactModulComponent, EditContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  contacts: Contactlist[] = [];
  isOpen: boolean = false;
  isMenuOpen: boolean = false;
  openDetail: boolean = false;
  isAddContactFormVisible: boolean = false;
  isEditContactFormVisible: boolean = false;
  selectedContact: Contactlist | null = null;

  successMessage: string = '';
  showSuccessMessage: boolean = false;
  isMobile: boolean = false;
  uIdRef = this.authService.uId;

  /**
   * @param contactlist - Service for contact operations
   * @param location - Angular location service for navigation
   * @param authService - Service for authentication
   */
  constructor(
    private contactlist: FirebaseService,
    private location: Location,
    private authService: AuthService
  ) {}

  /**
   * Initializes component and sets up responsive behavior.
   */
  ngOnInit() {
    this.contacts = this.contactlist.contacts;
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  /**
   * Gets the current user ID.
   */
  getUid() {
    return this.authService.uId;
  }

  /**
   * Checks if the current screen size is mobile.
   */
  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  get groupedContacts() {
    return this.contactlist.getGroupedContacts();
  }

  /**
   * Gets color for contact initial letter.
   *
   * @param letter - First letter of contact name
   */
  getColorForLetter(letter: string): string {
    return this.contactlist.getColorForLetter(letter);
  }

  /**
   * Opens the add contact form modal.
   */
  openAddContactForm() {
    this.isAddContactFormVisible = true;
  }

  /**
   * Adds a new contact to the database.
   *
   * @param formData - Contact data from the form
   */
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

  /**
   * Shows a success message to the user.
   *
   * @param message - Success message to display
   */
  showSuccessMessageBox(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
  }

  /**
   * Closes the add contact form modal.
   */
  closeAddContactForm() {
    this.isAddContactFormVisible = false;
  }

  /**
   * Opens the edit contact form modal.
   */
  openEdit() {
    this.isEditContactFormVisible = true;
  }

  /**
   * Closes the edit contact form modal.
   */
  closeEditContactForm() {
    this.isEditContactFormVisible = false;
  }

  /**
   * Opens the detail view for a selected contact.
   *
   * @param contact - Contact to display details for
   */
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

  /**
   * Fetches a single contact by ID and updates selected contact.
   *
   * @param id - Contact ID to fetch
   *
   * @throws {Error} When contact fetch fails
   */
  async getContactField(id: string) {
    const data = await this.contactlist.getSingleContactOnce(id);
    this.selectedContact = data;
  }

  /**
   * Deletes a contact from the database.
   *
   * @param contactId - Optional contact ID to delete
   *
   * @throws {Error} When contact deletion fails
   */
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

  /**
   * Updates the current contact and refreshes the view.
   *
   * @throws {Error} When contact update fails
   */
  async updateContact() {
    this.showSuccessMessageBox('Kontakt wurde erfolgreich aktualisiert!');
    this.closeEditContactForm();

    if (this.selectedContact?.id) {
      await this.getContactField(this.selectedContact.id);
    }
  }

  /**
   * Opens the options menu.
   */
  openOptionsMenu() {
    this.isMenuOpen = true;
  }

  /**
   * Closes the options menu.
   */
  closeOptionsMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Handles back navigation for mobile and desktop.
   */
  goBack(): void {
    if (this.isMobile) {
      this.isOpen = false;
      this.selectedContact = null;
    } else {
      this.location.back();
    }
  }
}
