import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showLayout = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkCurrentRoute();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute();
      }
    });
  }

  // Beispiel aller Events während einer Navigation:
  // 1. NavigationStart { url: '/login' }
  // 2. RoutesRecognized { url: '/login' }
  // 3. NavigationEnd { url: '/login' }     ← Nur hier reagieren!

  checkCurrentRoute() {
    // Holt die aktuelle URL vom Router
    const currentUrl = this.router.url;
    // Setzt showLayout auf true, außer wenn URL 'login' enthält
    this.showLayout = !currentUrl.includes('/login');
  }
}
