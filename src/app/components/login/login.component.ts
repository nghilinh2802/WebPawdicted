import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Attempting login with:', this.email, this.password);
    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        if (result && 'error' in result) {
          this.errorMessage = result.error;
        } else if (this.authService.isAdmin()) {
          alert('🎉 Chào mừng đến với trang quản lý!');
          this.router.navigate(['/role-management']);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Đã xảy ra lỗi không xác định.';
        console.error('Login error:', error);
      }
    });
  }
}