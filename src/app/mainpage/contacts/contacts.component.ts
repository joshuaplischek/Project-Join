import { Component } from '@angular/core';
import { Contactlist } from '../../contactlist';
import { FirebaseService } from '../../shared/services/firebase.service';
import { CommonModule } from '@angular/common';
import { TestComponent } from '../../test/test.component';
import { AddContactModulComponent } from "./add-contact-modul/add-contact-modul.component";
import { EditContactComponent } from "./edit-contact/edit-contact.component";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, AddContactModulComponent, EditContactComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contacts: Contactlist[] = [];
  isOpen: boolean = false;
  isAddContactFormVisible = false;
  isEditContactFormVisible = false; // Neue Variable

  constructor(private contactlist: FirebaseService) { }

  ngOnInit() {
    this.contacts = this.contactlist.contacts;
  }

  get groupedContacts() {
    const grouped: Record<string, Contactlist[]> = {};

    for (const contact of this.contacts) {
      const letter = contact.firstName[0].toUpperCase();
      grouped[letter] ??= [];
      grouped[letter].push(contact);
    }

    return Object.keys(grouped)
      .sort()
      .map(letter => ({ letter, contacts: grouped[letter] }));
  }

  openAddContact() {
    this.isAddContactFormVisible = true;
  }

  closeAddContact() {
    this.isAddContactFormVisible = false;
  }

  openSingleContact() {
    this.isOpen = !this.isOpen;
  }

  openEditContact() { // Neue Methode
    this.isEditContactFormVisible = true;
  }

  closeEditContact() { // Neue Methode
    this.isEditContactFormVisible = false;
  }

  openEdit() {
    this.openEditContact(); // Hier rufst du deine Edit-Methode auf
  }

  deleteContact() { }
}
