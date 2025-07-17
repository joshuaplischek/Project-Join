import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../interfaces/tasks';
import { TasksFirbaseService } from '../../../shared/services/tasks-firbase.service';
import { TaskDetailViewComponent } from './task-detail-view/task-detail-view.component';
import { TaskDetailEditComponent } from './task-detail-edit/task-detail-edit.component';

/**
 * Component for displaying and managing task details with view/edit modes.
 */
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, TaskDetailViewComponent, TaskDetailEditComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent {
  @Input() isVisible = false;
  @Input() task: Tasks | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<string>();

  isEditMode: boolean = false;

  /**
   * @param taskService - Service for task operations
   */
  constructor(private taskService: TasksFirbaseService) {}

  /**
   * Closes the task detail modal.
   */
  close(): void {
    this.isEditMode = false;
    this.closeModal.emit();
  }

  /**
   * Switches to edit mode.
   */
  onEditTask(): void {
    this.isEditMode = true;
  }

  /**
   * Handles task update and switches back to view mode.
   *
   * @param updatedTask - The updated task data
   */
  onTaskUpdated(updatedTask: Tasks) {
    this.task = updatedTask;
    this.isEditMode = false;
  }

  /**
   * Cancels edit mode and returns to view mode.
   */
  onCancelEdit(): void {
    this.isEditMode = false;
  }

  /**
   * Deletes the current task.
   *
   * @throws {Error} When task deletion fails
   */
  async onDeleteTask() {
    if (!this.task?.id) return;

    try {
      await this.taskService.deleteTask(this.task.id);
      this.taskDeleted.emit(this.task.id);
      this.close();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
}
