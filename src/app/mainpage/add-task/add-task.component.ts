import { Component } from '@angular/core';
import { AddtaskModalComponent } from '../../shared/addtask-modal/addtask-modal.component';

/**
 * Component for creating new tasks.
 */
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [AddtaskModalComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  constructor() {}

  showSuccessMessage: boolean = false;
  successMessage: string = '';

  /**
   * Handles successful task creation.
   * @param {string} message - The success message to display
   */
  onTaskSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
  }
}
