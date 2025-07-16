import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddtaskModalComponent } from '../../../shared/addtask-modal/addtask-modal.component';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, AddtaskModalComponent],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.scss',
})
export class TaskAddComponent {
  @Input() isVisible: boolean = false;
  @Input() initialStatus: string = 'todo';
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskSuccess = new EventEmitter<string>();
  @ViewChild(AddtaskModalComponent) addTaskModal!: AddtaskModalComponent;

  ngAfterViewInit() {
    this.addTaskModal.taskCreated.subscribe(() => {
      this.close();
    });

    // Success Message weiterleiten
    this.addTaskModal.successMessage.subscribe((message: string) => {
      this.taskSuccess.emit(message);
    });
  }

  ngOnDestroy() {
    this.addTaskModal?.taskCreated.unsubscribe();
    this.addTaskModal?.successMessage.unsubscribe();
  }

  close() {
    this.closeModal.emit();
  }
}
