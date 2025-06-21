import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  getDoc,
} from '@angular/fire/firestore';
import { Contactlist } from '../../contactlist';
import { single } from 'rxjs';
import { idToken } from '@angular/fire/auth';

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

  subContactList() {
    return onSnapshot(this.getContacts(), (list) => {
      list.forEach((element) => {
        this.contacts.push(this.setContactsObject(element.data(), element.id));  
      });
    });
  }

  subSingleContact(id: any, callback: (data: any) => void) {
  return onSnapshot(this.getSingleContact('contactlist', id), (element) => {
    if (element.exists()) {
      const data = element.data();
      callback({ id: element.id, ...data });
    } else {
      console.warn('Dokument existiert nicht.');
      callback(null);
    }
  });
}


  getContacts() {
    return collection(this.firestore, 'contactlist');
  }

  getSingleContact(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

  setContactsObject(obj: any, id: string): Contactlist {
    return {
      id: id,
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone,
    };
  }

  addContact() {}

  deleteContact() {}

  changeContact() {}

  ngOnDestroy() {
    this.unsubscribe();
  }
}
