import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  input,
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
  @Input() isVisible = false;
  @Input() initialStatus: string = 'todo';
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(AddtaskModalComponent) addTaskModal!: AddtaskModalComponent;

  ngAfterViewInit() {
    this.addTaskModal.taskCreated.subscribe(() => {
      this.close();
    });
  }
  ngOnDestroy() {
    this.addTaskModal?.taskCreated.unsubscribe();
  }

  close() {
    this.closeModal.emit();
  }
}
