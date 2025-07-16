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
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TaskAddComponent } from './task-add/task-add.component';

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
    FormsModule,
    TaskAddComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(public taskService: TasksFirbaseService) {}
  private subscription: Subscription = new Subscription();
  @Input() selectedTask: Tasks | null = null;

  filteredTasks: Tasks[] = [];
  dragStartDelay: number = 0;
  isTaskDetailVisible: boolean = false;
  isTaskAddVisible: boolean = false;
  selectedTaskForDetail: Tasks | null = null;
  selectedStatus: string = 'todo';
  searchText: string = '';
  showSearchContainer: boolean = false;

  showSuccessMessage: boolean = false;
  successMessage: string = '';

  ngOnInit() {
    this.filteredTasks = this.taskService.tasks;
    this.subscription.add(
      this.taskService.tasksChanged.subscribe(() => {
        this.filteredTasks = this.taskService.tasks;
        this.searchTask();
      })
    );
    this.setDragStartDelay();
    window.addEventListener('resize', () => this.setDragStartDelay());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('resize', () => this.setDragStartDelay());
  }

  get todoTasks(): Tasks[] {
    return this.filteredTasks.filter((task) => task.status === 'todo');
  }

  get inProgressTasks(): Tasks[] {
    return this.filteredTasks.filter((task) => task.status === 'inprogress');
  }

  get awaitFeedbackTasks(): Tasks[] {
    return this.filteredTasks.filter((task) => task.status === 'awaitfeedback');
  }

  get doneTasks(): Tasks[] {
    return this.filteredTasks.filter((task) => task.status === 'done');
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

  openAddTask(status: string) {
    console.log('Opening add task with status:', status);
    this.selectedStatus = status;
    this.isTaskAddVisible = true;
  }

  closeAddTask() {
    this.isTaskAddVisible = false;
  }

  openTaskDetail(task: Tasks) {
    this.selectedTaskForDetail = task;
    this.isTaskDetailVisible = true;
  }

  closeTaskDetail() {
    this.isTaskDetailVisible = false;
    setTimeout(() => {
      this.selectedTaskForDetail = null;
    }, 300);
  }

  setDragStartDelay() {
    this.dragStartDelay = window.innerWidth <= 1024 ? 300 : 0;
  }

  searchKey(data: string) {
    this.searchText = data;
    this.searchTask();
  }

  searchTask() {
    const search = this.searchText.toLowerCase();
    if (!search) {
      this.filteredTasks = this.taskService.tasks;
      return;
    }
    this.filteredTasks = this.taskService.tasks.filter(
      (element) =>
        element.title?.toLowerCase().includes(search) ||
        element.description?.toLowerCase().includes(search)
    );
  }

  onTaskSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
  }

  onTaskDeleted(taskId: string): void {
    this.filteredTasks = this.filteredTasks.filter(
      (task) => task.id !== taskId
    );
    this.closeTaskDetail();
  }
}
