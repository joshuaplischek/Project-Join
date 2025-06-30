import { Component } from '@angular/core';
import { CompactTaskComponent } from '../../shared/compact-task/compact-task.component';
import { TasksFirbaseService } from '../../shared/services/tasks-firbase.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CompactTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  constructor(public taskService: TasksFirbaseService) { }

  dragElement: string | undefined;

  get todoTasks() {
    return this.taskService.tasks.filter(task => task.status === 'todo');
  }

  get inProgressTasks() {
    return this.taskService.tasks.filter(task => task.status === 'inprogress');
  }

  get awaitFeedbackTasks() {
    return this.taskService.tasks.filter(task => task.status === 'awaitfeedback');
  }

  get doneTasks() {
    return this.taskService.tasks.filter(task => task.status === 'done');
  }

  startDragging(taskId: any) {
   this.dragElement = taskId;

  }



}
