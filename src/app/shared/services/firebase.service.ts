import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { Contactlist } from '../../contactlist';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);

  contacts: Contactlist[] = [];
  unsubscribe;

  constructor() {
    this.unsubscribe = this.subContactList();
  }

  subContactList() {
    return onSnapshot(this.getContacts(), (list) => {
      //wichtig um Doppelung im Array zu vermeiden
      this.contacts = [];
      list.forEach((element) => {
        this.contacts.push(this.setContactsObject(element.data(), element.id));
      });
      console.log('Contacts Array:', this.contacts);
      this.sortContacts();
    })
  }

  getContacts() {
    return collection(this.firestore, 'contactlist');
  }

  sortContacts() {
    this.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }

  getSingleContact(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

  setContactsObject(obj: any, id: string): Contactlist {
    return {
      id: id,
      firstName: obj.firstName || '',
      lastName: obj.lastName || '',
      email: obj.email || '',
      phone: obj.phone,
    }
  }

  addContact(formData: Contactlist) {
    const contactsCollection = this.getContacts();

    addDoc(contactsCollection, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    }).catch((error) => {
      console.error("Fehler beim Hinzufügen des Kontakts:", error)
    })
  }

  deleteContact() { }

  changeContact() { }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
