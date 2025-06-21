import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userName: string = 'Admin User'; // Placeholder for dynamic user data

  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Example: Remove token
    this.router.navigate(['/login']);
  }
}