import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  title: string = '';
  date: Timestamp | null = null;

  clicked = false;
  titleTouched = false;
  dateTouched = false;



  // timestamp = Timestamp.fromDate(new Date(dateString));
}
