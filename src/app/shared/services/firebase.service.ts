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
    })
  }

  getContacts() {
    return collection(this.firestore, 'contactlist');
  }

  sortContacts() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  getSingleContact(colId: string, docId: string){
    return doc(collection(this.firestore, colId), docId)
  }

  setContactsObject(obj: any, id: string): Contactlist {
    return {
      id: id,
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone,
    }
  }

  addContact() { }

  deleteContact() { }

  changeContact() { }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
