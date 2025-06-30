import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../interfaces/tasks';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  @Input() isVisible = false;
  @Input() task: Tasks | null = null;
  @Output() closeModal = new EventEmitter<void>();

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
    const rawSubtasks = this.task?.subtasks || [];
    
    return rawSubtasks.map(subtask => {
      if (typeof subtask === 'string') {
        return { title: subtask, done: false };
      }
      return subtask;
    });
  }

  close() {
    this.closeModal.emit();
  }

  editTask() {
    console.log('Edit task clicked');
  }

  deleteTask() {
    console.log('Delete task clicked');
  }

  toggleSubtask(index: number) {
    if (this.task?.subtasks && this.task.subtasks[index]) {
      this.task.subtasks[index].done = !this.task.subtasks[index].done;
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
