import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Component for application header with user menu and navigation.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isLimitedMode: boolean = false;
  isMenuOpen: boolean = false;

  /**
   * @param authService - Service for authentication operations
   * @param router - Angular router for navigation
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Opens the quick menu dropdown.
   */
  openQuickMenu() {
    this.isMenuOpen = true;
  }

  /**
   * Closes the quick menu dropdown.
   */
  closeQuickMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Gets user initials for display in header.
   */
  getInitials() {
    const displayName = this.authService.displayName;
    this.getFirstLetters(displayName);
    return this.getFirstLetters(displayName) || 'GU';
  }

  /**
   * Extracts first letters from each word in a name.
   *
   * @param name - Full name string
   */
  getFirstLetters(name: string) {
    const firstLetters = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
    return firstLetters;
  }

  /**
   * Logs out the user and navigates to login page.
   */
  logout() {
    this.authService.logout();
    this.closeQuickMenu();
    this.router.navigate(['/login']);
  }
}
