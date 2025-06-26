import { Component } from '@angular/core';
import { Tasks } from '../../../interfaces/tasks';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss'
})
export class CompactTaskComponent {
  tasks: Tasks[] = [];

  constructor(private taskService: FirebaseService){
    this.tasks = this.taskService.tasks
  }

  
}
