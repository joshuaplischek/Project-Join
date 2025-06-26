import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TasksFirbaseService } from '../services/tasks-firbase.service';
import { Tasks } from '../../../interfaces/tasks';

@Component({
  selector: 'app-compact-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-task.component.html',
  styleUrl: './compact-task.component.scss'
})
export class CompactTaskComponent {
  

  constructor(private taskService: TasksFirbaseService) {
    
  }

 getList(){
  return this.taskService.tasks
 }

}
