import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddtaskModalComponent } from '../../../shared/addtask-modal/addtask-modal.component';

/**
 * Component for adding tasks in board view.
 */
@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, AddtaskModalComponent],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss',
})
export class TaskAddComponent implements AfterViewInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() initialStatus: string = 'todo';
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskSuccess = new EventEmitter<string>();
  @ViewChild(AddtaskModalComponent) addTaskModal!: AddtaskModalComponent;

  /**
   * Sets up subscriptions after view initialization.
   */
  ngAfterViewInit() {
    this.addTaskModal.taskCreated.subscribe(() => {
      this.close();
    });
    this.addTaskModal.successMessage.subscribe((message: string) => {
      this.taskSuccess.emit(message);
    });
  }

  /**
   * Cleans up subscriptions on component destroy.
   */
  ngOnDestroy() {
    this.addTaskModal?.taskCreated.unsubscribe();
    this.addTaskModal?.successMessage.unsubscribe();
  }

  /**
   * Closes the task add modal.
   */
  close() {
    this.closeModal.emit();
  }
}
