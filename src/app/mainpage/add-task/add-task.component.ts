import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Contactlist } from '../../../interfaces/contactlist';
import { TasksFirestoreData } from '../../../interfaces/tasks';
import { TasksFirbaseService } from '../../shared/services/tasks-firbase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  constructor(public contactlist: FirebaseService, public taskService: TasksFirbaseService, private router: Router) {}

  title: string = '';
    description: string = '';
  date:any;
  category: string = '';
  selectedPrio: string = '';
  contactInput: string = '';
  newSubtask: string = '';
    successMessage = '';

  showSuccessMessage = false;
  categoryDropDownOpen = false;
  contactDropDownOpen = false;
  titleTouched = false;
  dateTouched = false;
  categoryTouched = false;

  selectedContacts: Contactlist[] = [];
  filteredContacts: Contactlist[] = [];
  subtasks: string[] = [];

  ngOnInit() {
    this.filteredContacts = this.allContacts;
  }

  get allContacts() {
    return this.contactlist.getSortedContacts();
  }

  selectPrio(prio: string) {
    this.selectedPrio = prio;
  }

  standardColors: string[] = [
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

  isSelected(contact: Contactlist) {
    // .some() gibt true zurück, wenn die Bedingung für mindestens ein Element zutrifft, sonst false
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.id === contact.id
    );
  }

  toggleContact(contact: Contactlist) {
    if (this.isSelected(contact)) {
      this.selectedContacts = this.selectedContacts.filter(
        (selectedContact) => selectedContact.id !== contact.id
      );
    } else {
      this.selectedContacts.push(contact);
    }
  }

  onCategoryBlur() {
    this.categoryDropDownOpen = false;
    if (!this.category) {
      this.categoryTouched = true;
    }
  }

  addSubtask() {
  if (this.newSubtask.trim()) {
    this.subtasks.push(this.newSubtask.trim());
    this.newSubtask = '';
  }
}
async addTaskToDBViaTemplateClick() {
  const processedFormData: TasksFirestoreData = {
    title: this.title,
    description: this.description,
    category: this.category,
    assignedTo: this.selectedContacts.map(c => `${c.firstName} ${c.lastName}`),
    date: this.date instanceof Date ? this.date : new Date(this.date),
    priority: this.selectedPrio || 'medium', // Fallback falls keine Priorität gesetzt
    subtasks: this.subtasks.map(title => ({ title, done: false })),
    status: 'todo'
  };

  try {
    await this.addTaskToDB(processedFormData); // Warte auf die async Operation
    this.showSuccessMessageBox('Task wurde erfolgreich hinzugefügt!');
    this.clearForm();
    setTimeout(() => {
      this.router.navigate(['/board']);
    }, 2000);
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Tasks:', error);
    this.showSuccessMessageBox('Fehler beim Hinzufügen des Tasks!');
  }
}

  async addTaskToDB(formData: TasksFirestoreData) {
  try {
    await this.taskService.addTask(formData); // Warte auf die Promise
  } catch (error) {
    console.error('Fehler in addTaskToDB:', error);
    throw error; // Fehler weiterreichen
  }
}

    showSuccessMessageBox(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.date = null;
    this.selectedPrio = '';
    this.category = '';
    this.selectedContacts = [];
    this.categoryDropDownOpen = false;
    this.contactDropDownOpen = false;
    this.titleTouched = false;
    this.dateTouched = false;
    this.categoryTouched = false;
  }
}
