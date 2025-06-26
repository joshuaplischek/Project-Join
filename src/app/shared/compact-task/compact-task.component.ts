import { Component } from '@angular/core';
import { Tasks, TasksFirestoreData } from '../../../interfaces/tasks';
import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss'
})
export class CompactTaskComponent {
  tasks: Tasks[] = [];

  constructor(private taskService: TasksFirbaseService) {
    this.tasks = this.taskService.tasks;
    console.log(this.tasks);
  }

}
