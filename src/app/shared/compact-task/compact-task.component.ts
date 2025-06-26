import { Component } from '@angular/core';
import { Task } from 'zone.js/lib/zone-impl';
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
  tasks: Task[] = [];

  constructor(private taskService: FirebaseService){}
}
