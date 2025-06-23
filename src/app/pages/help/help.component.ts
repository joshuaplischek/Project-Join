import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { LegalnoticeComponent } from '../legalnotice/legalnotice.component';
import { NavComponent } from '../../shared/nav/nav.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [HeaderComponent, NavComponent, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {

}
