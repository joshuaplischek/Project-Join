import { Component } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { ContactsComponent } from "./contacts/contacts.component";
import { BoardComponent } from "./board/board.component";
import { AddTaskComponent } from "./add-task/add-task.component";

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [ContactsComponent, BoardComponent, AddTaskComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss'
})
export class MainpageComponent {

}


