import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainpageComponent } from "./mainpage/mainpage.component";
import { PrivacypoliceComponent } from "./pages/privacypolice/privacypolice.component";
import { Firestore } from 'firebase/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainpageComponent, PrivacypoliceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';
  firestore: Firestore = inject(Firestore);
}
