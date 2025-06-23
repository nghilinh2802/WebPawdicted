// import { Component, EventEmitter, Output } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   standalone: false,
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent {
//   @Output() sidebarToggle = new EventEmitter<void>();
//   isLoggedIn: boolean = false;
//   userName: string = '';

//   constructor(private authService: AuthService, private router: Router) {
//     this.checkLoginStatus();
//   }

//   checkLoginStatus(): void {
//     const user = this.authService.getCurrentUser();
//     this.isLoggedIn = !!user;
//     this.userName = user?.lastName || user?.customer_email?.split('@')[0] || 'Admin';
//   }

//   toggleSidebar(): void {
//     this.sidebarToggle.emit();
//   }

//   goToLogin(): void {
//     this.router.navigate(['/login']);
//   }

//   logout(): void {
//     this.authService.logout().subscribe({
//       next: () => {
//         this.isLoggedIn = false;
//         this.userName = '';
//         this.router.navigate(['/login']);
//       },
//       error: (error: any) => {
//         console.error('Logout error:', error);
//         this.router.navigate(['/login']);
//       }
//     });
//   }

//   navigateToDashboard(): void {
//     this.router.navigate(['/dashboard']);
//   }
// }



import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  @Output() sidebarToggle = new EventEmitter<void>();
  isLoggedIn: boolean = false;
  userName: string = '';
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.checkLoginStatus();
    this.startAuthSubscription();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  startAuthSubscription(): void {
    this.authSubscription = this.authService.getCurrentUser().subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.userName = user?.lastName || user?.customer_email?.split('@')[0] || 'Admin';
    });
  }

  checkLoginStatus(): void {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.userName = user?.lastName || user?.customer_email?.split('@')[0] || 'Admin';
    });
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.userName = '';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}