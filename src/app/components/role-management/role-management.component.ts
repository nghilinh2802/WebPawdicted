import { Component, OnInit } from '@angular/core';
import { Database, ref, get, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  users: any[] = [];
  newUser = { email: '', role: 'Staff' };
  adminPassword = '';
  isAddUserPopupOpen = false;
  isConfirmPopupOpen = false;
  selectedUsers: { [key: string]: boolean } = {};
  selectAll: boolean = false;

  constructor(
    private db: Database,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkIfAdmin();
    this.loadUsers();
  }

  checkIfAdmin(): void {
    if (!this.authService.isAdmin()) {
      alert('Bạn không có quyền truy cập vào trang này.');
      this.router.navigate(['/dashboard']);
    }
  }

  loadUsers() {
    const dbRef = ref(this.db, 'customers');
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        this.users = Object.keys(users)
          .map(key => ({
            id: key,
            email: users[key].customer_email,
            role: users[key].role
          }))
          .filter(user => user.role === 'Admin' || user.role === 'Staff');
        console.log('Filtered users (Admin/Staff only):', this.users);
      } else {
        this.users = [];
        console.log('No users found in Firebase');
      }
    }).catch(error => {
      console.error('Error loading users:', error);
      alert('Lỗi tải danh sách người dùng!');
    });
  }

  openAddUserPopup() {
    this.isAddUserPopupOpen = true;
  }

  closeAddUserPopup() {
    this.isAddUserPopupOpen = false;
    this.newUser = { email: '', role: 'Staff' };
  }

  checkUserExists() {
    const dbRef = ref(this.db, 'customers');
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const user = Object.keys(users).find(key => users[key].customer_email === this.newUser.email);
        if (user) {
          this.isAddUserPopupOpen = false;
          this.isConfirmPopupOpen = true;
        } else {
          alert('Email này không tồn tại trong hệ thống!');
        }
      } else {
        alert('Không có người dùng nào trong hệ thống!');
      }
    }).catch(error => {
      console.error('Error checking user:', error);
      alert('Lỗi kiểm tra tài khoản!');
    });
  }

  confirmAddUser() {
    const FIXED_PASSWORD = 'admin123';
    if (this.adminPassword === FIXED_PASSWORD) {
      this.updateUserRole();
      this.closeConfirmPopup();
    } else {
      alert('Mật khẩu không chính xác!');
    }
  }

  updateUserRole() {
    const dbRef = ref(this.db, 'customers');
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find(key => users[key].customer_email === this.newUser.email);
        if (userKey) {
          const userRef = ref(this.db, `customers/${userKey}`);
          set(userRef, { ...users[userKey], role: this.newUser.role }).then(() => {
            alert('Cập nhật vai trò thành công!');
            this.loadUsers();
            this.closeAddUserPopup();
          }).catch(error => {
            console.error('Error updating role:', error);
            alert('Lỗi cập nhật vai trò!');
          });
        }
      }
    });
  }

  deleteUser(userId: string) {
    const userRef = ref(this.db, `customers/${userId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();
        set(userRef, { ...user, role: 'Customer' }).then(() => {
          alert('Xóa vai trò thành công!');
          this.loadUsers();
        }).catch(error => {
          console.error('Error updating role:', error);
          alert('Lỗi cập nhật vai trò!');
        });
      }
    });
  }

  closeConfirmPopup() {
    this.isConfirmPopupOpen = false;
    this.adminPassword = '';
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.users.forEach(user => {
      this.selectedUsers[user.id] = this.selectAll;
    });
  }

  updateSelectedUsersRole() {
    const selectedIds = Object.keys(this.selectedUsers).filter(id => this.selectedUsers[id]);
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng!');
      return;
    }

    selectedIds.forEach(id => {
      const userRef = ref(this.db, `customers/${id}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const user = snapshot.val();
          set(userRef, { ...user, role: 'Customer' }).then(() => {
            console.log(`User ${id} updated to Customer`);
          }).catch(error => {
            console.error(`Error updating user ${id}:`, error);
          });
        }
      });
    });
    alert('Xóa vai trò thành công!');
    this.loadUsers();
    this.selectedUsers = {};
    this.selectAll = false;
  }
}