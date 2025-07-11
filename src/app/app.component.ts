import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showFullLayout = false;
  showLimitedLayout = false;
  showNoLayout = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkCurrentRoute();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute();
      }
    });

    this.authService.isLoggedIn$.subscribe(() => {
      this.checkCurrentRoute();
    });
  }

  // Beispiel aller Events während einer Navigation:
  // 1. NavigationStart { url: '/login' }
  // 2. RoutesRecognized { url: '/login' }
  // 3. NavigationEnd { url: '/login' }     ← Nur hier reagieren!

  private checkCurrentRoute() {
    // Holt die aktuelle URL vom Router
    const currentUrl = this.router.url;
    const isLoggedIn = this.authService.isLoggedIn;

    // Kein Layout für Login (immer)
    if (currentUrl.includes('/login')) {
      this.showNoLayout = true;
      this.showLimitedLayout = false;
      this.showFullLayout = false;
    }
    // Wenn eingeloggt: immer volles Layout (außer Login)
    else if (isLoggedIn) {
      this.showNoLayout = false;
      this.showLimitedLayout = false;
      this.showFullLayout = true;
    }
    // Nicht eingeloggt + Privacy/Legal → limitiertes Layout
    else if (
      currentUrl.includes('/privacypolicy') ||
      currentUrl.includes('/legalnotice')
    ) {
      this.showNoLayout = false;
      this.showLimitedLayout = true;
      this.showFullLayout = false;
    }
    // Fallback: volles Layout
    else {
      this.showNoLayout = false;
      this.showLimitedLayout = false;
      this.showFullLayout = true;
    }
  }
}
