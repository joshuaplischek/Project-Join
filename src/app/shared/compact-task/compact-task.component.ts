import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { FirebaseService } from '../services/firebase.service';
import { Subtask, Tasks } from '../../../interfaces/tasks';

/**
 * Component for displaying tasks in compact card format.
 */
@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss',
})
export class CompactTaskComponent {
  @Input() task!: Tasks;
  @Input() subtask!: Subtask[];
  @Output() taskClick = new EventEmitter<Tasks>();

  selectedSubtask: Subtask | null = null;

  /**
   * @param taskService - Service for task operations
   * @param contactService - Service for contact operations
   */
  constructor(
    private taskService: TasksFirbaseService,
    private contactService: FirebaseService
  ) {}

  /**
   * Handles task click events and emits task data.
   *
   * @param event - Optional click event
   */
  onTaskClick(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.taskClick.emit(this.task);
  }

  /**
   * Gets all tasks from the task service.
   */
  getList() {
    return this.taskService.tasks;
  }

  /**
   * Counts the number of completed subtasks.
   */
  getSubtasksDone(): number {
    return this.task?.subtasks?.filter((sub) => sub.done).length ?? 0;
  }

  /**
   * Gets the total number of subtasks.
   */
  getSubtaskLength(): number {
    return this.task?.subtasks?.length ?? 0;
  }

  /**
   * Truncates description text to specified length.
   *
   * @param desc - Description text to truncate
   * @param max - Maximum character length
   */
  getShortDescription(desc: string | undefined, max: number = 40): string {
    if (!desc) return '';
    return desc.length > max ? desc.slice(0, max) + '...' : desc;
  }

  /**
   * Gets the appropriate priority icon path.
   */
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

  /**
   * Gets color for contact initial letter.
   *
   * @param letter - First letter of contact name
   */
  getColorForLetter(letter: string): string {
    return this.contactService.getColorForLetter(letter);
  }

  get assignedUsers(): string[] {
    return this.task?.assignedTo || [];
  }

  get hasAssignedUsers(): boolean {
    return this.assignedUsers.length > 0;
  }

  /**
   * Gets the first 3 assigned users for display.
   */
  getDisplayedUsers(): string[] {
    return this.assignedUsers.slice(0, 3);
  }

  /**
   * Calculates remaining users count beyond display limit.
   */
  getRemainingUsersCount(): number {
    return Math.max(0, this.assignedUsers.length - 3);
  }
}
