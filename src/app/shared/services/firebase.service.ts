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

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  contacts: Contactlist[] = [];
  unsubscribe;

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

  getColorForLetter(letter: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const index = alphabet.indexOf(letter.toUpperCase());
    if (index === -1) return this.standardColors[0];
    return this.standardColors[index % this.standardColors.length];
  }

  subContactList() {
    return onSnapshot(this.getContacts(), (list) => {
      this.contacts = [];
      list.forEach((element) => {
        this.contacts.push(this.setContactsObject(element.data(), element.id));
      });
    });
  }

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

  getSortedContacts(): Contactlist[] {
    return [...this.contacts].sort((a, b) => {
      const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
      const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  getContacts() {
    return collection(this.firestore, 'contactlist');
  }

  sortContacts() {
    this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  getSingleContact(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setContactsObject(obj: ContactlistFirestoreData, id: string): Contactlist {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      phone: obj.phone || '',
    };
  }

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

  async deleteContact(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'contactlist', id));
    } catch (error) {
      console.error('Fehler beim Löschen des Kontakts:', error);
    }
  }

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

  ngOnDestroy() {
    this.unsubscribe();
  }
}
