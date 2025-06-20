import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contactform',
  standalone: true,
  imports: [],
  templateUrl: './contactform.component.html',
  styleUrl: './contactform.component.scss'
})
export class ContactformComponent {

  @Input() heading: string = '';
  @Input() subheading: string = '';
  @Input() buttonOne: string = '';
  @Input() buttonTwo: string = '';
}
