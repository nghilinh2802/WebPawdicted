import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login', 'isAdmin']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate on successful login', () => {
    authService.login.and.returnValue(of({ role: 'Admin' }));
    authService.isAdmin.and.returnValue(true);
    component.email = 'linh@gmail.com';
    component.password = 'admin123';
    component.login();
    expect(authService.login).toHaveBeenCalledWith('linh@gmail.com', 'admin123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed login', () => {
    authService.login.and.returnValue(throwError(() => new Error('User is not an admin')));
    component.email = 'wrong@gmail.com';
    component.password = 'wrong';
    component.login();
    expect(component.errorMessage).toBe('User is not an admin');
  });
});