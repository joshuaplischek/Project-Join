import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, onSnapshot } from 'firebase/firestore';
import { Contactlist } from '../../contactlist';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  firestore: Firestore = inject(Firestore);

  contacts: Contactlist[] = [];
  unsubscribe;

  docRef = doc(this.firestore, 'contactlist');


  constructor() {
    this.unsubscribe = this.subContactList();
  }

  subContactList() {
    return onSnapshot(this.getContacts(), (list) => {
      list.forEach((element) => {
        this.contacts.push(this.setContactsObject(element.data(), element.id));
      })
    })
  }

  getContacts() {
    return collection(this.firestore, 'contactlist');
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
