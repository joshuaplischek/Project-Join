import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../../interfaces/tasks';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { TasksFirbaseService } from '../../../../shared/services/tasks-firbase.service';

/**
 * Component for displaying task details in read-only view.
 */
@Component({
  selector: 'app-task-detail-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail-view.component.html',
  styleUrl: './task-detail-view.component.scss',
})
export class TaskDetailViewComponent {
  @Input() task: Tasks | null = null;
  @Output() editTask = new EventEmitter<void>();
  @Output() deleteTask = new EventEmitter<void>();

  /**
   * @param contactService - Service for contact operations
   * @param taskService - Service for task operations
   */
  constructor(
    public contactService: FirebaseService,
    private taskService: TasksFirbaseService
  ) {}

  get hasAssignedUsers(): boolean {
    return this.task?.assignedTo ? this.task.assignedTo.length > 0 : false;
  }

  get hasSubtasks(): boolean {
    return this.task?.subtasks ? this.task.subtasks.length > 0 : false;
  }

  get assignedUsers(): string[] {
    return this.task?.assignedTo || [];
  }

  get subtasks() {
    const rawSubtasks = this.task?.subtasks || [];
    return rawSubtasks.map((subtask) => {
      if (typeof subtask === 'string') {
        return { title: subtask, done: false };
      }
      return subtask;
    });
  }

  /**
   * Toggles the completion status of a subtask.
   *
   * @param index - Index of the subtask to toggle
   *
   * @throws {Error} When subtask update fails
   */
  async toggleSubtask(index: number) {
    if (this.task?.subtasks && this.task.subtasks[index] && this.task.id) {
      this.task.subtasks[index].done = !this.task.subtasks[index].done;

      try {
        await this.taskService.updateTaskStatus(this.task.id, {
          subtasks: this.task.subtasks,
        });
      } catch (error) {
        console.error('Error updating subtask:', error);
        this.task.subtasks[index].done = !this.task.subtasks[index].done;
      }
    }
  }

  /**
   * Gets the color for a contact's initial letter.
   *
   * @param letter - First letter of contact name
   */
  getColorForLetter(letter: string): string {
    return this.contactService.getColorForLetter(letter);
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
   * Emits edit task event.
   */
  onEditTask() {
    this.editTask.emit();
  }

  /**
   * Emits delete task event.
   */
  onDeleteTask() {
    this.deleteTask.emit();
  }
}
