import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Component for application navigation menu.
 */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  @Input() isLimitedMode = false;

  /**
   * @param router - Angular router for navigation
   * @param authService - Service for authentication operations
   */
  constructor(public router: Router, private authService: AuthService) {}

  /**
   * Checks if the current route is active.
   *
   * @param route - Route path to check
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  /**
   * Gets the current user ID.
   */
  getUid() {
    return this.authService.uId;
  }
}
