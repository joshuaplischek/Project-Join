import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Contactlist } from '../../../interfaces/contactlist';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  constructor(public contactlist: FirebaseService){};

  title: string = '';
  date: Timestamp | null = null;
  titleTouched = false;
  dateTouched = false;
  dropdownOpen = false;
  selectedContacts: Contactlist[] = [];
  selectedPrio: string = '';

get allContacts() {
  return this.contactlist.contacts;
}

  selectPrio(prio: string) {
    this.selectedPrio = prio;
  }

  standardColors: string[] = [
  '#ff7a00', '#1fd7c1', '#6e52ff', '#9327ff', '#ffbb2b',
  '#fc71ff', '#ff4646', '#3F51B5', '#462f8a'
];

getColorForLetter(letter: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const index = alphabet.indexOf(letter.toUpperCase());
  if (index === -1) return this.standardColors[0];
  return this.standardColors[index % this.standardColors.length];
}

//Dropdown Menu Contact selected
  isSelected(contact: Contactlist) {
    // .some() gibt true zurück, wenn die Bedingung für mindestens ein Element zutrifft, sonst false
    return this.selectedContacts.some(selectedContact => selectedContact.id === contact.id);
  }

toggleContact(contact: Contactlist) {
  if (this.isSelected(contact)) {
    this.selectedContacts = this.selectedContacts.filter(selectedContact => selectedContact.id !== contact.id);
  } else {
    this.selectedContacts.push(contact);
  }
}

}
