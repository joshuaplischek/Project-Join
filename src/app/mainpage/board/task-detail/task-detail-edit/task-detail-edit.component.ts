import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Tasks } from '../../../../../interfaces/tasks';
import { Contactlist } from '../../../../../interfaces/contactlist';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { TasksFirbaseService } from '../../../../shared/services/tasks-firbase.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-task-detail-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-detail-edit.component.html',
  styleUrl: './task-detail-edit.component.scss',
})
export class TaskDetailEditComponent implements OnInit, OnDestroy {
  @Input() task: Tasks | null = null;
  @Output() taskUpdated = new EventEmitter<Tasks>();
  @Output() cancelEdit = new EventEmitter<void>();

  editTitle: string = '';
  editDescription: string = '';
  editDate: Date | null = null;
  editCategory: string = '';
  editPriority: string = '';
  editSubtasks: { title: string; done: boolean }[] = [];
  selectedContacts: Contactlist[] = [];

  categoryDropDownOpen = false;
  contactDropDownOpen = false;

  titleTouched = false;
  dateTouched = false;
  categoryTouched = false;

  minDate: Date = new Date();

  constructor(
    public contactService: FirebaseService,
    private taskService: TasksFirbaseService
  ) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    if (this.task) {
      this.loadTaskData();
    }
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  loadTaskData() {
    if (!this.task) return;

    this.editTitle = this.task.title || '';
    this.editDescription = this.task.description || '';
    this.editDate = this.task.date?.toDate() || null;
    this.editCategory = this.task.category || '';
    this.editPriority = this.task.priority || '';

    this.editSubtasks =
      this.task.subtasks?.map((subtask) => {
        if (typeof subtask === 'string') {
          return { title: subtask, done: false };
        }
        return subtask;
      }) || [];

    this.selectedContacts = this.contactService
      .getSortedContacts()
      .filter((contact) =>
        this.task?.assignedTo?.includes(
          contact.firstName + ' ' + contact.lastName
        )
      );

    this.titleTouched = false;
    this.dateTouched = false;
    this.categoryTouched = false;
  }

  get allContacts() {
    return this.contactService.getSortedContacts();
  }

  validateForm(): boolean {
    return this.editTitle &&
      this.editDate &&
      this.editCategory &&
      this.validateDate(this.editDate)
      ? true
      : false;
  }

  validateDate(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  async saveTask(): Promise<void> {
    if (!this.validateForm() || !this.task?.id) return;

    try {
      const updateData = this.createUpdateData();
      await this.taskService.updateTaskStatus(this.task.id, updateData);

      // Update local task object
      const updatedTask = { ...this.task, ...updateData };
      this.taskUpdated.emit(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  createUpdateData(): Partial<Tasks> {
    return {
      title: this.editTitle,
      description: this.editDescription,
      date: this.editDate ? Timestamp.fromDate(this.editDate) : this.task!.date,
      category: this.editCategory,
      priority: this.editPriority,
      assignedTo: this.selectedContacts.map(
        (contact) => `${contact.firstName} ${contact.lastName}`
      ),
      subtasks: this.editSubtasks,
    };
  }

  onCancelEdit() {
    this.cancelEdit.emit();
  }

  selectPrio(prio: string) {
    this.editPriority = prio;
  }

  getColorForLetter(letter: string): string {
    return this.contactService.getColorForLetter(letter);
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

  editSubtask(index: number) {
    const currentTitle = this.editSubtasks[index]?.title;
    if (currentTitle) {
      const newTitle = prompt('Edit subtask:', currentTitle);
      if (newTitle && newTitle.trim() && newTitle.trim() !== currentTitle) {
        this.editSubtasks[index].title = newTitle.trim();
      }
    }
  }

  toggleEditSubtask(index: number) {
    if (this.editSubtasks[index]) {
      this.editSubtasks[index].done = !this.editSubtasks[index].done;
    }
  }

  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownContainer = target.closest('.dropdown-container');

    if (!dropdownContainer && this.categoryDropDownOpen) {
      this.categoryDropDownOpen = false;
      if (!this.editCategory) {
        this.categoryTouched = true;
      }
    }
  }
}
