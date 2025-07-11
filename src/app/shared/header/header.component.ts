import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isLimitedMode = false;
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  openQuickMenu() {
    this.isMenuOpen = true;
  }

  closeQuickMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeQuickMenu();
    this.router.navigate(['/login']);
  }
}
