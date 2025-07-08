import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tasks } from '../../../../../interfaces/tasks';
import { FirebaseService } from '../../../../shared/services/firebase.service';

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

  constructor(public contactService: FirebaseService) {}

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

  toggleSubtask(index: number) {
    if (this.task?.subtasks && this.task.subtasks[index]) {
      this.task.subtasks[index].done = !this.task.subtasks[index].done;
    }
  }

  getColorForLetter(letter: string): string {
    return this.contactService.getColorForLetter(letter);
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

  onEditTask() {
    this.editTask.emit();
  }

  onDeleteTask() {
    this.deleteTask.emit();
  }
}
