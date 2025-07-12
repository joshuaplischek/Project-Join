import { Component } from '@angular/core';
import { TasksFirbaseService } from '../shared/services/tasks-firbase.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})
export class MainpageComponent {
  constructor(public taskService: TasksFirbaseService) {}

  ngOnInit() {
    this.taskService.tasksChanged.subscribe(() => {
      console.log('Tasks geladen:', this.taskService.tasks);
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

getNextDeadlineInfo() {

}

}
