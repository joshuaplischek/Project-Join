import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, onSnapshot } from '@angular/fire/firestore';
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
      list.forEach((element) => {
        this.contacts.push(this.setContactsObject(element.data(), element.id));
      })
      this.sortContacts();
      console.log(this.contacts);
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

  addContact(formData: any) { }

  deleteContact() { }

  changeContact() { }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
