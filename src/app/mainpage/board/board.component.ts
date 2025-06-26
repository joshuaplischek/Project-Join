import { Component } from '@angular/core';
import { CompactTaskComponent } from '../../shared/compact-task/compact-task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CompactTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

}
