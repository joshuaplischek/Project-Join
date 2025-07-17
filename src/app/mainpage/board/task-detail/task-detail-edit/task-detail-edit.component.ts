import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
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

/**
 * Component for editing task details.
 */
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

  @ViewChild('subtaskInput') subtaskInput!: ElementRef;
  @ViewChild('editInput') editInput!: ElementRef;

  editTitle: string = '';
  editDescription: string = '';
  editDate: Date | null = null;
  editCategory: string = '';
  editPriority: string = '';
  editSubtasks: { title: string; done: boolean }[] = [];
  selectedContacts: Contactlist[] = [];

  categoryDropDownOpen: boolean = false;
  contactDropDownOpen: boolean = false;

  titleTouched: boolean = false;
  dateTouched: boolean = false;
  categoryTouched: boolean = false;

  minDate: Date = new Date();

  editingSubtaskIndex: number | null = null;
  editingSubtaskValue: string = '';
  isSubtaskActive: boolean = false;

  /**
   * @param contactService - Service for contact operations
   * @param taskService - Service for task operations
   */
  constructor(
    public contactService: FirebaseService,
    private taskService: TasksFirbaseService
  ) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  /**
   * Initializes component and loads task data.
   */
  ngOnInit() {
    if (this.task) {
      this.loadTaskData();
    }
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  /**
   * Cleanup event listeners.
   */
  ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  /**
   * Loads task data into edit form.
   */
  loadTaskData() {
    if (!this.task) return;

    this.loadBasicTaskFields();
    this.loadSubtasks();
    this.loadSelectedContacts();
    this.resetValidationFlags();
  }

  /**
   * Loads basic task fields into edit form.
   */
  private loadBasicTaskFields() {
    if (!this.task) return;

    this.editTitle = this.task.title || '';
    this.editDescription = this.task.description || '';
    this.editDate = this.task.date?.toDate() || null;
    this.editCategory = this.task.category || '';
    this.editPriority = this.task.priority || '';
  }

  /**
   * Loads and processes subtasks from task data.
   */
  private loadSubtasks() {
    if (!this.task?.subtasks) {
      this.editSubtasks = [];
      return;
    }

    this.editSubtasks = this.task.subtasks.map((subtask) => {
      if (typeof subtask === 'string') {
        return { title: subtask, done: false };
      }
      return subtask;
    });
  }

  /**
   * Loads selected contacts based on task assignment.
   */
  private loadSelectedContacts() {
    if (!this.task?.assignedTo) {
      this.selectedContacts = [];
      return;
    }

    this.selectedContacts = this.contactService
      .getSortedContacts()
      .filter((contact) =>
        this.task?.assignedTo?.includes(
          `${contact.firstName} ${contact.lastName}`
        )
      );
  }

  /**
   * Resets form validation flags.
   */
  private resetValidationFlags() {
    this.titleTouched = false;
    this.dateTouched = false;
    this.categoryTouched = false;
  }

  get allContacts() {
    return this.contactService.getSortedContacts();
  }

  /**
   * Validates the edit form.
   *
   * @param date - Date to validate
   */
  validateForm(): boolean {
    return this.editTitle && this.editDate && this.editCategory ? true : false;
  }

  /**
   * Validates if date is not in the past.
   *
   * @param date - Date to validate
   */
  validateDate(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  /**
   * Saves the edited task.
   *
   * @throws {Error} When task update fails
   */
  async saveTask() {
    if (!this.validateForm() || !this.task?.id) return;

    try {
      const updateData = this.createUpdateData();
      await this.taskService.updateTaskStatus(this.task.id, updateData);

      const updatedTask = { ...this.task, ...updateData };
      this.taskUpdated.emit(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  /**
   * Creates update data object for task.
   */
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

  /**
   * Cancels the edit operation.
   */
  onCancelEdit() {
    this.cancelEdit.emit();
  }

  /**
   * Sets the priority for the task.
   *
   * @param prio - Priority level to set
   */
  selectPrio(prio: string) {
    this.editPriority = prio;
  }

  /**
   * Gets color for contact initial.
   *
   * @param letter - First letter of contact name
   */
  getColorForLetter(letter: string): string {
    return this.contactService.getColorForLetter(letter);
  }

  /**
   * Checks if contact is selected.
   *
   * @param contact - Contact to check
   */
  isSelected(contact: Contactlist) {
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.id === contact.id
    );
  }

  /**
   * Toggles contact selection.
   *
   * @param contact - Contact to toggle
   */
  toggleContact(contact: Contactlist) {
    if (this.isSelected(contact)) {
      this.selectedContacts = this.selectedContacts.filter(
        (selectedContact) => selectedContact.id !== contact.id
      );
    } else {
      this.selectedContacts.push(contact);
    }
  }

  /**
   * Handles category dropdown blur event.
   */
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

  /**
   * Shows subtask input controls.
   */
  showSubtaskControls() {
    this.isSubtaskActive = true;
  }

  /**
   * Handles subtask input blur event.
   */
  onSubtaskBlur() {
    setTimeout(() => {
      this.isSubtaskActive = false;
    }, 100);
  }

  /**
   * Adds a new subtask.
   *
   * @param title - Optional subtask title
   */
  addSubtask(title?: string) {
    const subtaskTitle = title || this.subtaskInput?.nativeElement.value;
    if (subtaskTitle && subtaskTitle.trim()) {
      this.editSubtasks.push({ title: subtaskTitle.trim(), done: false });
      if (this.subtaskInput) {
        this.subtaskInput.nativeElement.value = '';
      }
    }
  }

  /**
   * Starts editing a subtask.
   *
   * @param index - Index of subtask to edit
   */
  editSubtask(index: number) {
    this.editingSubtaskIndex = index;
    this.editingSubtaskValue = this.editSubtasks[index]?.title || '';
    setTimeout(() => {
      if (this.editInput) {
        this.editInput.nativeElement.focus();
      }
    }, 0);
  }

  /**
   * Saves the edited subtask.
   */
  saveEditedSubtask() {
    if (this.editingSubtaskIndex !== null && this.editingSubtaskValue.trim()) {
      this.editSubtasks[this.editingSubtaskIndex].title =
        this.editingSubtaskValue.trim();
    }
    this.editingSubtaskIndex = null;
    this.editingSubtaskValue = '';
  }

  /**
   * Cancels subtask editing.
   */
  cancelEditSubtask() {
    this.editingSubtaskIndex = null;
    this.editingSubtaskValue = '';
  }

  /**
   * Handles keyboard events in subtask editing.
   *
   * @param event - Keyboard event
   */
  onSubtaskKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEditedSubtask();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditSubtask();
    }
  }

  /**
   * Removes a subtask.
   *
   * @param index - Index of subtask to remove
   */
  removeSubtask(index: number) {
    this.editSubtasks.splice(index, 1);
  }

  /**
   * Toggles subtask completion status.
   *
   * @param index - Index of subtask to toggle
   */
  toggleEditSubtask(index: number) {
    if (this.editSubtasks[index]) {
      this.editSubtasks[index].done = !this.editSubtasks[index].done;
    }
  }

  /**
   * Handles document click events for dropdown management.
   *
   * @param event - Click event
   */
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
