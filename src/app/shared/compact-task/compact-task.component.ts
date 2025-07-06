import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { FirebaseService } from '../services/firebase.service';
import { Subtask, Tasks } from '../../../interfaces/tasks';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss'
})
export class CompactTaskComponent {

  constructor(
    private taskService: TasksFirbaseService,
    private contactService: FirebaseService
  ) { }

  @Input() task!: Tasks;
  @Output() taskClick = new EventEmitter<Tasks>();

  onTaskClick(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.taskClick.emit(this.task);
  }

  @Input() subtask!: Subtask[];
  selectedSubtask: Subtask | null = null;

  getList() {
    return this.taskService.tasks
  }

  getSubtasksDone(): number {
    return this.task?.subtasks?.filter((sub) => sub.done).length ?? 0;
  }

  getSubtaskLength(): number {
    return this.task?.subtasks?.length ?? 0;
  }

  getShortDescription(desc: string | undefined, max: number = 40): string {
    if (!desc) return '';
      return desc.length > max ? desc.slice(0, max) + '...' : desc;
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

  getColorForLetter(letter: string): string {
    return this.contactService.getColorForLetter(letter);
  }

  get assignedUsers(): string[] {
    return this.task?.assignedTo || [];
  }

  get hasAssignedUsers(): boolean {
    return this.assignedUsers.length > 0;
  }

  getDisplayedUsers(): string[] {
    return this.assignedUsers.slice(0, 3);
  }

  getRemainingUsersCount(): number {
    return Math.max(0, this.assignedUsers.length - 3);
  }
}
