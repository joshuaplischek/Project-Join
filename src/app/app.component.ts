import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivacypoliceComponent } from "./pages/privacypolice/privacypolice.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrivacypoliceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor() {
  }
}
