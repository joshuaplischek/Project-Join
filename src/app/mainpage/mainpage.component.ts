import { Component } from '@angular/core';
import { TasksFirbaseService } from '../shared/services/tasks-firbase.service';
import { RouterLink } from '@angular/router';
import { Tasks } from '../../interfaces/tasks';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})
export class MainpageComponent {
  constructor(public taskService: TasksFirbaseService, public authService: AuthService) {}

  ngOnInit() {
    this.taskService.tasksChanged.subscribe(() => {
      this.nextDeadlineInfo;
    });
  }

  getLogedInPerson() {
    return this.authService.displayName || 'Guest';
  }

  getGreeting() {
    let dateTime = new Date();
    let hour = dateTime.getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  }

  getNumberOftasks(task: string) {
    return this.taskService.tasks.filter((t) => t.status === task).length;
  }

  // Hilfsfunktion für Datumskonvertierung
  private getTaskDate(task: Tasks): Date {
    return task.date instanceof Date ? task.date : task.date.toDate();
  }

  // Hilfsfunktion für Zeitstempel (nutzt getTaskDate)
  private getTaskTime(task: Tasks): number {
    return this.getTaskDate(task).getTime();
  }

  // Hilfsfunktion für Prioritäts-Formatierung
  private formatPriority(priority: string): string {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : '';
  }

  get nextDeadlineInfo() {
    const nextTask = this.filterDeadlineTasks();
    // Early return wenn keine Task gefunden
    if (!nextTask) {
      return { count: 0, priority: '', date: '' };
    }
    const dateToCompare = this.getTaskTime(nextTask);
    // Filtert Tasks mit gleicher Deadline und Priorität
    const sameTasks = this.taskService.tasks.filter(
      (task) =>
        task.date &&
        task.status !== 'done' &&
        this.getTaskTime(task) === dateToCompare &&
        task.priority === nextTask.priority
    );

    return {
      count: sameTasks.length,
      priority: this.formatPriority(nextTask.priority),
      date: this.convertDate(nextTask),
    };
  }

  convertDate(task: Tasks | null): string {
    if (!task || !task.date) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
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
    const today = new Date().setHours(0, 0, 0, 0);
    const upcomingTasks = this.taskService.tasks
      .filter((task) => {
        if (!task.date || task.status === 'done') return false;
        // Nutzt die private Hilfsmethode
        const taskDate = this.getTaskDate(task);
        return taskDate.setHours(0, 0, 0, 0) >= today;
      })
      .sort((a, b) => {
        // Nutzt die private Hilfsmethode
        const dateA = this.getTaskDate(a).getTime();
        const dateB = this.getTaskDate(b).getTime();
        // Wenn die Daten unterschiedlich sind, sortiere nach Datum (früher zuerst)
        if (dateA !== dateB) return dateA - dateB;
        // Bei gleichem Datum: sortiere nach Priorität (urgent vor medium vor low)
        return prioOrder[a.priority] - prioOrder[b.priority];
      });
    // Gibt den ersten Task zurück (nächste Deadline) oder null wenn keine Tasks vorhanden
    return upcomingTasks.length > 0 ? upcomingTasks[0] : null;
  }
}
