import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

/**
 * Component for displaying help and support information.
 */
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  /**
   * @param location - Angular location service for navigation
   */
  constructor(private location: Location) {}

  /**
   * Navigates back to the previous page.
   */
  goBack() {
    this.location.back();
  }
}
