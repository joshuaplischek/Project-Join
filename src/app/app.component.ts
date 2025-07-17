import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { NavComponent } from './shared/nav/nav.component';
import { AuthService } from './shared/services/auth.service';

/**
 * Root component managing application layout based on route and authentication state.
 */
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

  /**
   * @param router - Angular router for navigation
   * @param authService - Service for authentication operations
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Initializes component and sets up route and authentication subscriptions.
   */
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

  /**
   * Determines which layout to show based on current route and authentication status.
   */
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

  /**
   * Checks if current URL is a login route.
   *
   * @param url - URL to check
   */
  private isLoginRoute(url: string): boolean {
    return url.includes('/login');
  }

  /**
   * Checks if current URL is a public page route.
   *
   * @param url - URL to check
   */
  private isPublicPageRoute(url: string): boolean {
    return url.includes('/privacypolicy') || url.includes('/legalnotice');
  }

  /**
   * Sets layout to show no navigation or header.
   */
  private setNoLayout() {
    this.showNoLayout = true;
    this.showLimitedLayout = false;
    this.showFullLayout = false;
  }

  /**
   * Sets layout to show limited navigation without full functionality.
   */
  private setLimitedLayout() {
    this.showNoLayout = false;
    this.showLimitedLayout = true;
    this.showFullLayout = false;
  }

  /**
   * Sets layout to show full navigation and header.
   */
  private setFullLayout() {
    this.showNoLayout = false;
    this.showLimitedLayout = false;
    this.showFullLayout = true;
  }
}
