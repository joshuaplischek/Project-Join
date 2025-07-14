import { Component } from '@angular/core';
import { TasksFirbaseService } from '../shared/services/tasks-firbase.service';
import { RouterLink } from '@angular/router';
import { Tasks } from '../../interfaces/tasks';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})
export class MainpageComponent {
  constructor(public taskService: TasksFirbaseService) {}

  ngOnInit() {
    this.taskService.tasksChanged.subscribe(() => {
      console.log('Tasks geladen:', this.taskService.tasks);
      this.nextDeadlineInfo;
      console.log('Next Deadline Info:', this.nextDeadlineInfo.priority);
      
    });
  }

  getGreeting() {
    let dateTime = new Date();
    let hour = dateTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getNumberOftasks(task: string){
    return this.taskService.tasks.filter(t => t.status === task).length;
  }

  get nextDeadlineInfo() {
    const nextTask = this.filterDeadlineTasks();
    if (!nextTask) return { count: 0, priority: '', date: '' };
      const dateToCompare = nextTask.date instanceof Date ? nextTask.date.getTime() : nextTask.date.toDate().getTime();
      const sameTasks = this.taskService.tasks.filter(t =>
      t.date && t.status !== 'done' && ((t.date instanceof Date ? t.date.getTime() : t.date.toDate().getTime()) === dateToCompare) &&
      t.priority === nextTask.priority
    );
    return {
      count: sameTasks.length,
      priority: nextTask.priority ? nextTask.priority.charAt(0).toUpperCase() + nextTask.priority.slice(1) : '',
      date: this.convertDate(nextTask)
    };
  }

  convertDate(task: Tasks | null): string {
    if (!task || !task.date) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    if (task.date instanceof Date) {
      return task.date.toLocaleDateString('en-EN', options);
    }
    if (typeof task.date.toDate === 'function') {
      return task.date.toDate().toLocaleDateString('en-En', options);
    }
    return '';
  }

  filterDeadlineTasks() {
    const prioOrder: Record<string, number> = { urgent: 1, medium: 2, low: 3 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksWithDate = this.taskService.tasks.filter(t => {
      if (!t.date || t.status === 'done') return false;
      const taskDate = t.date instanceof Date ? t.date : t.date.toDate();
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() >= today.getTime();
    });
    if (tasksWithDate.length === 0) return null;
    const sorted = tasksWithDate.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date.getTime() : a.date.toDate().getTime();
      const dateB = b.date instanceof Date ? b.date.getTime() : b.date.toDate().getTime();
      if (dateA !== dateB) return dateA - dateB;
      return (prioOrder[a.priority] ?? 99) - (prioOrder[b.priority] ?? 99);
    });
    return sorted[0];
  }
}
