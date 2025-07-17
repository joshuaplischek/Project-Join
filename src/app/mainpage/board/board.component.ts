import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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

/**
 * Component for managing task board with drag-and-drop functionality.
 */
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
export class BoardComponent implements OnInit, OnDestroy {
  @Input() selectedTask: Tasks | null = null;

  private subscription: Subscription = new Subscription();

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

  /**
   * @param taskService - Service for task operations
   */
  constructor(public taskService: TasksFirbaseService) {}

  /**
   * Initializes component and sets up subscriptions.
   */
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

  /**
   * Cleans up subscriptions and event listeners.
   */
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

  /**
   * Handles drag and drop events for tasks.
   *
   * @param event - The drag drop event
   *
   * @throws {Error} When task status update fails
   */
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

  /**
   * Determines task status based on drop container ID.
   *
   * @param event - The drag drop event
   */
  private getStatusByArray(event: CdkDragDrop<Tasks[]>) {
    const id = event.container.id as string;
    if (id.includes('todo')) return 'todo';
    if (id.includes('inprogress')) return 'inprogress';
    if (id.includes('awaitfeedback')) return 'awaitfeedback';
    if (id.includes('done')) return 'done';
    return '';
  }

  /**
   * Opens task add modal with specified status.
   *
   * @param status - Initial status for new task
   */
  openAddTask(status: string) {
    this.selectedStatus = status;
    this.isTaskAddVisible = true;
  }

  /**
   * Closes the task add modal.
   */
  closeAddTask() {
    this.isTaskAddVisible = false;
  }

  /**
   * Opens task detail modal for specified task.
   *
   * @param task - Task to display details for
   */
  openTaskDetail(task: Tasks) {
    this.selectedTaskForDetail = task;
    this.isTaskDetailVisible = true;
  }

  /**
   * Closes the task detail modal.
   */
  closeTaskDetail() {
    this.isTaskDetailVisible = false;
    setTimeout(() => {
      this.selectedTaskForDetail = null;
    }, 300);
  }

  /**
   * Sets drag start delay based on screen size.
   */
  setDragStartDelay() {
    this.dragStartDelay = window.innerWidth <= 1024 ? 300 : 0;
  }

  /**
   * Handles search input and triggers task filtering.
   *
   * @param data - Search query string
   */
  searchKey(data: string) {
    this.searchText = data;
    this.searchTask();
  }

  /**
   * Filters tasks based on search text.
   */
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

  /**
   * Handles successful task creation.
   *
   * @param message - Success message to display
   */
  onTaskSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessMessage = true;
  }

  /**
   * Handles task deletion and updates filtered tasks.
   *
   * @param taskId - ID of deleted task
   */
  onTaskDeleted(taskId: string) {
    this.filteredTasks = this.filteredTasks.filter(
      (task) => task.id !== taskId
    );
    this.closeTaskDetail();
  }
}
