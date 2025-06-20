import { Component } from '@angular/core';
import { ContactformComponent } from "../mainpage/contacts/contactform/contactform.component";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ContactformComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

}
