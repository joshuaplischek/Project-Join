import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Contactlist,
  ContactlistFirestoreData,
} from '../../../interfaces/contactlist';

/**
 * Service for managing contacts in Firebase Firestore.
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  contacts: Contactlist[] = [];
  unsubscribe;

  /**
   * Initializes service and subscribes to contact list changes.
   */
  constructor() {
    this.unsubscribe = this.subContactList();
  }

  private readonly standardColors: string[] = [
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

  /**
   * Gets a color for a contact's initial letter.
   *
   * @param letter - First letter of contact name
   */
  getColorForLetter(letter: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const index = alphabet.indexOf(letter.toUpperCase());
    if (index === -1) return this.standardColors[0];
    return this.standardColors[index % this.standardColors.length];
  }

  /**
   * Subscribes to real-time contact list updates.
   */
  subContactList() {
    return onSnapshot(this.getContacts(), (list) => {
      this.contacts = [];
      list.forEach((element) => {
        this.contacts.push(this.setContactsObject(element.data(), element.id));
      });
    });
  }

  /**
   * Fetches a single contact by ID once.
   *
   * @param id - Contact ID to fetch
   *
   * @throws {Error} When contact fetch fails
   */
  async getSingleContactOnce(id: string) {
    const docRef = doc(this.firestore, 'contactlist', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return this.setContactsObject(data, snapshot.id);
    } else {
      return null;
    }
  }

  /**
   * Groups contacts by first letter of first name.
   */
  getGroupedContacts() {
    const grouped: Record<string, Contactlist[]> = {};
    for (const contact of this.contacts) {
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

  /**
   * Returns contacts sorted alphabetically by full name.
   */
  getSortedContacts(): Contactlist[] {
    return [...this.contacts].sort((a, b) => {
      const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
      const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  /**
   * Gets the Firestore collection reference for contacts.
   */
  getContacts() {
    return collection(this.firestore, 'contactlist');
  }

  /**
   * Sorts the local contacts array by first name.
   */
  sortContacts() {
    this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  /**
   * Gets a single document reference.
   *
   * @param colId - Collection ID
   * @param docId - Document ID
   */
  getSingleContact(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * Converts Firestore data to Contact object.
   *
   * @param obj - Raw Firestore contact data
   * @param id - Document ID
   */
  setContactsObject(obj: ContactlistFirestoreData, id: string): Contactlist {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      phone: obj.phone || '',
    };
  }

  /**
   * Adds a new contact to Firestore.
   *
   * @param formData - Contact data to add
   *
   * @throws {Error} When contact creation fails
   */
  async addContact(formData: Contactlist) {
    const contactsCollection = this.getContacts();
    try {
      await addDoc(contactsCollection, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Kontakts:', error);
    }
  }

  /**
   * Deletes a contact from Firestore.
   *
   * @param id - Contact ID to delete
   *
   * @throws {Error} When contact deletion fails
   */
  async deleteContact(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'contactlist', id));
    } catch (error) {
      console.error('Fehler beim Löschen des Kontakts:', error);
    }
  }

  /**
   * Updates an existing contact in Firestore.
   *
   * @param id - Contact ID to update
   * @param formData - Updated contact data
   *
   * @throws {Error} When contact update fails
   */
  async updateContact(id: string, formData: Contactlist) {
    try {
      const docRef = doc(this.firestore, 'contactlist', id);
      await updateDoc(docRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Kontakts:', error);
    }
  }

  /**
   * Cleans up subscriptions when service is destroyed.
   */
  ngOnDestroy() {
    this.unsubscribe();
  }
}
