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
  showFullLayout: boolean = false;
  showLimitedLayout: boolean = false;
  showNoLayout: boolean = false;

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
    const currentUrl = this.router.url;
    const isLoggedIn = this.authService.isLoggedIn;

    if (this.isLoginRoute(currentUrl)) {
      this.setNoLayout();
    } else if (isLoggedIn) {
      this.setFullLayout();
    } else if (this.isPublicPageRoute(currentUrl)) {
      this.setLimitedLayout();
    } else {
      this.setFullLayout();
    }
  }

  private isLoginRoute(url: string): boolean {
    return url.includes('/login');
  }

  private isPublicPageRoute(url: string): boolean {
    return url.includes('/privacypolicy') || url.includes('/legalnotice');
  }

  private setNoLayout(): void {
    this.showNoLayout = true;
    this.showLimitedLayout = false;
    this.showFullLayout = false;
  }

  private setLimitedLayout(): void {
    this.showNoLayout = false;
    this.showLimitedLayout = true;
    this.showFullLayout = false;
  }

  private setFullLayout(): void {
    this.showNoLayout = false;
    this.showLimitedLayout = false;
    this.showFullLayout = true;
  }
}
