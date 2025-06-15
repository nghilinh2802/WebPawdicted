import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleManagementComponent } from './role-management.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../../environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
describe('RoleManagementComponent', () => {
  let component: RoleManagementComponent;
  let fixture: ComponentFixture<RoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        RoleManagementComponent
      ],
      providers: [
        AuthService,
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideDatabase(() => getDatabase()),
        provideAuth(() => getAuth())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle select all', () => {
    component.users = [{ id: '1', email: 'test1@gmail.com', role: 'Customer' }, { id: '2', email: 'test2@gmail.com', role: 'Admin' }];
    component.toggleSelectAll();
    expect(component.selectedUsers['1']).toBe(true);
    expect(component.selectedUsers['2']).toBe(true);
    component.toggleSelectAll();
    expect(component.selectedUsers['1']).toBe(false);
    expect(component.selectedUsers['2']).toBe(false);
  });
});