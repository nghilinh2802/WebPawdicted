import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false; // Mobile toggle state
  @Input() isSidebarVisible: boolean = true; // Desktop hide/show state
  @Output() sidebarVisibilityToggle = new EventEmitter<void>(); // Emit toggle event

  toggleSidebarVisibility(): void {
    this.sidebarVisibilityToggle.emit(); // Notify parent to toggle visibility
  }
}