import { Component, Input } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CompactTaskComponent } from '../../shared/compact-task/compact-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TasksFirbaseService } from '../../shared/services/tasks-firbase.service';
import { Tasks } from '../../../interfaces/tasks';
import { doc, updateDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CompactTaskComponent,
    TaskDetailComponent,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    CdkDragPlaceholder,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(public taskService: TasksFirbaseService) {}
  private subscription: Subscription = new Subscription();
  @Input() selcetedTask: Tasks | null = null;
  dragStartDelay = 0;
  isTaskDetailVisible = false;
  selectedTaskForDetail: Tasks | null = null;

  todo: Tasks[] = [];

  inprogress: Tasks[] = [];

  awaitfeedback: Tasks[] = [];

  done: Tasks[] = [];

  ngOnInit() {
    this.taskService.subTasks();
    this.subscription.add(
      this.taskService.tasksChanged.subscribe(() => {
        this.updateArrays();
      })
    );
    this.setDragStartDelay();
    window.addEventListener('resize', () => this.setDragStartDelay());
  }

  updateArrays() {
    this.todo = this.taskService.tasks.filter((task) => task.status === 'todo');
    this.inprogress = this.taskService.tasks.filter(
      (task) => task.status === 'inprogress'
    );
    this.awaitfeedback = this.taskService.tasks.filter(
      (task) => task.status === 'awaitfeedback'
    );
    this.done = this.taskService.tasks.filter((task) => task.status === 'done');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('resize', () => this.setDragStartDelay());
  }

  get todoTasks(): Tasks[] {
    return this.taskService.tasks.filter((task) => task.status === 'todo');
  }

  get inProgressTasks(): Tasks[] {
    return this.taskService.tasks.filter(
      (task) => task.status === 'inprogress'
    );
  }

  get awaitFeedbackTasks(): Tasks[] {
    return this.taskService.tasks.filter(
      (task) => task.status === 'awaitfeedback'
    );
  }

  get doneTasks(): Tasks[] {
    return this.taskService.tasks.filter((task) => task.status === 'done');
  }

  drop(event: CdkDragDrop<Tasks[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      const newStatus = this.getStatusByArray(event);
      if (movedTask && newStatus) {
        movedTask.status = newStatus;
        if (typeof movedTask.id === 'string') {
          this.taskService.updateTaskStatus(movedTask.id, {
            status: newStatus,
          });
        }
      }
      this.updateArrays();
    }
  }

  private getStatusByArray(event: CdkDragDrop<Tasks[]>) {
    const id = event.container.id as string;
    if (id.includes('todo')) return 'todo';
    if (id.includes('inprogress')) return 'inprogress';
    if (id.includes('awaitfeedback')) return 'awaitfeedback';
    if (id.includes('done')) return 'done';
    return '';
  }

  openTaskDetail(task: Tasks) {
    this.selectedTaskForDetail = task;
    this.isTaskDetailVisible = true;
  }

  closeTaskDetail() {
    this.isTaskDetailVisible = false;
    // Nach der Animation das selectedTask zurücksetzen
    setTimeout(() => {
      this.selectedTaskForDetail = null;
    }, 300);
  }

  setDragStartDelay() {
    this.dragStartDelay = window.innerWidth <= 1024 ? 150 : 0;
  }
}
