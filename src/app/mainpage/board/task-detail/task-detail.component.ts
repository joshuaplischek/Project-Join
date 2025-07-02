import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Tasks } from '../../../../interfaces/tasks';
import { Contactlist } from '../../../../interfaces/contactlist';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { TasksFirbaseService } from '../../../shared/services/tasks-firbase.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() task: Tasks | null = null;
  @Output() closeModal = new EventEmitter<void>();

  isEditMode = false;
  editTitle: string = '';
  editDescription: string = '';
  editDate: Date | null = null;
  editCategory: string = '';
  editPriority: string = '';
  editSubtasks: { title: string; done: boolean }[] = [];
  selectedContacts: Contactlist[] = [];
  filteredContacts: Contactlist[] = [];
  
  categoryDropDownOpen = false;
  contactDropDownOpen = false;
  
  titleTouched = false;
  dateTouched = false;
  categoryTouched = false;

  contactInput: string = '';

  constructor(
    public contactService: FirebaseService,
    private taskService: TasksFirbaseService
  ) {}

  ngOnInit() {
    this.filteredContacts = this.allContacts;
  }

  ngOnChanges() {
    if (this.task) {
      this.isEditMode = false;
    }
  }

  get allContacts() {
    return this.contactService.getSortedContacts();
  }

  get hasAssignedUsers(): boolean {
    return !!(this.task?.assignedTo && this.task.assignedTo.length > 0);
  }

  get hasSubtasks(): boolean {
    return !!(this.task?.subtasks && this.task.subtasks.length > 0);
  }

  get assignedUsers(): string[] {
    return this.task?.assignedTo || [];
  }

  get subtasks() {
    if (this.isEditMode) {
      return this.editSubtasks;
    }
    
    const rawSubtasks = this.task?.subtasks || [];
    
    return rawSubtasks.map(subtask => {
      if (typeof subtask === 'string') {
        return { title: subtask, done: false };
      }
      return subtask;
    });
  }

  close() {
    this.isEditMode = false;
    this.categoryDropDownOpen = false;
    this.contactDropDownOpen = false;
    this.closeModal.emit();
  }

  editTask() {
    if (!this.task) return;
    
    this.isEditMode = true;
    this.editTitle = this.task.title || '';
    this.editDescription = this.task.description || '';
    this.editDate = this.task.date?.toDate() || null;
    this.editCategory = this.task.category || '';
    this.editPriority = this.task.priority || '';
    
    this.editSubtasks = this.task.subtasks?.map(subtask => {
      if (typeof subtask === 'string') {
        return { title: subtask, done: false };
      }
      return subtask;
    }) || [];
    
    this.selectedContacts = this.allContacts.filter(contact => 
      this.task?.assignedTo?.includes(contact.firstName + ' ' + contact.lastName)
    );
    
    this.titleTouched = false;
    this.dateTouched = false;
    this.categoryTouched = false;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.categoryDropDownOpen = false;
    this.contactDropDownOpen = false;
  }

  async saveTask() {
    if (!this.task?.id || !this.validateForm()) return;
    
    try {
      const updateData = {
        title: this.editTitle,
        description: this.editDescription,
        date: this.editDate ? Timestamp.fromDate(this.editDate) : this.task.date,
        category: this.editCategory,
        priority: this.editPriority,
        assignedTo: this.selectedContacts.map(contact => contact.firstName + ' ' + contact.lastName),
        subtasks: this.editSubtasks
      };
      
      await this.taskService.updateTaskStatus(this.task.id, updateData);
      
      // Update local task object
      this.task = {
        ...this.task,
        ...updateData
      };
      
      this.isEditMode = false;
      
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  validateForm(): boolean {
    return !!(this.editTitle && this.editDate && this.editCategory);
  }

  deleteTask() {
    console.log('Delete task clicked');
  }

  toggleSubtask(index: number) {
    if (this.task?.subtasks && this.task.subtasks[index]) {
      this.task.subtasks[index].done = !this.task.subtasks[index].done;
    }
  }

  selectPrio(prio: string) {
    this.editPriority = prio;
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
    if (!this.editCategory) {
      this.categoryTouched = true;
    }
  }

  addSubtask(title: string) {
    if (title.trim()) {
      this.editSubtasks.push({ title: title.trim(), done: false });
    }
  }

  removeSubtask(index: number) {
    this.editSubtasks.splice(index, 1);
  }

  toggleEditSubtask(index: number) {
    if (this.editSubtasks[index]) {
      this.editSubtasks[index].done = !this.editSubtasks[index].done;
    }
  }

  getPriorityIcon(): string {
    switch (this.task?.priority?.toLowerCase()) {
      case 'urgent':
        return '/assets/images/board/prio-urgent.svg';
      case 'medium':
        return '/assets/images/board/prio-medium.svg';
      case 'low':
        return '/assets/images/board/prio-low.svg';
      default:
        return '/assets/images/board/prio-medium.svg';
    }
  }
}
