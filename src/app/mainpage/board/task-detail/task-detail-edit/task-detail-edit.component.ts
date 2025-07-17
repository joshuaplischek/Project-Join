import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
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
export class TaskDetailEditComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() task: Tasks | null = null;
  @Output() taskUpdated = new EventEmitter<Tasks>();
  @Output() cancelEdit = new EventEmitter<void>();

  @ViewChild('subtaskInput') subtaskInput!: ElementRef;
  @ViewChild('editInput') editInput!: ElementRef;

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

  // Neue Properties für Subtask-Bearbeitung
  editingSubtaskIndex: number | null = null;
  editingSubtaskValue: string = '';
  isSubtaskActive: boolean = false;

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

  ngAfterViewInit() {
    // Optional: Focus handling wenn nötig
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
      this.editCategory
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

  get displayedContacts() {
    return this.selectedContacts.slice(0, 3);
  }

  get remainingCount() {
    return this.selectedContacts.length - 3;
  }

  get hasExtraContacts() {
    return this.selectedContacts.length > 3;
  }

  // Neue Subtask-Methoden
  showSubtaskControls() {
    this.isSubtaskActive = true;
  }

  onSubtaskBlur() {
    setTimeout(() => {
      this.isSubtaskActive = false;
    }, 100);
  }

  addSubtask(title?: string) {
    const subtaskTitle = title || this.subtaskInput?.nativeElement.value;
    if (subtaskTitle && subtaskTitle.trim()) {
      this.editSubtasks.push({ title: subtaskTitle.trim(), done: false });
      if (this.subtaskInput) {
        this.subtaskInput.nativeElement.value = '';
      }
    }
  }

  editSubtask(index: number) {
    this.editingSubtaskIndex = index;
    this.editingSubtaskValue = this.editSubtasks[index]?.title || '';
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    }, 0);
  }

  saveEditedSubtask() {
    if (this.editingSubtaskIndex !== null && this.editingSubtaskValue.trim()) {
      this.editSubtasks[this.editingSubtaskIndex].title =
        this.editingSubtaskValue.trim();
    }
    this.editingSubtaskIndex = null;
    this.editingSubtaskValue = '';
  }

  cancelEditSubtask() {
    this.editingSubtaskIndex = null;
    this.editingSubtaskValue = '';
  }

  onSubtaskKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEditedSubtask();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditSubtask();
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
