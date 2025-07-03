import { Component } from '@angular/core';
import { AddtaskModalComponent } from '../../shared/addtask-modal/addtask-modal.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [AddtaskModalComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  constructor() {}
}
