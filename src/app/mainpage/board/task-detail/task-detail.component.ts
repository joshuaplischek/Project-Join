import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../interfaces/tasks';
import { TasksFirbaseService } from '../../../shared/services/tasks-firbase.service';
import { TaskDetailViewComponent } from './task-detail-view/task-detail-view.component';
import { TaskDetailEditComponent } from './task-detail-edit/task-detail-edit.component';

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

  isEditMode = false;

  constructor(private taskService: TasksFirbaseService) {}

  close() {
    this.isEditMode = false;
    this.closeModal.emit();
  }

  onEditTask() {
    this.isEditMode = true;
  }

  onTaskUpdated(updatedTask: Tasks) {
    this.task = updatedTask;
    this.isEditMode = false;
  }

  onCancelEdit() {
    this.isEditMode = false;
  }

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
