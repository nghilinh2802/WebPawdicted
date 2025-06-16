import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, setDoc, doc, updateDoc, query, where, getDoc } from '@angular/fire/firestore';
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
    private firestore: Firestore,
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

  async loadUsers() {
    try {
      const customersCollection = collection(this.firestore, 'customers');
      const q = query(customersCollection, where('role', 'in', ['Admin', 'Staff']));
      const querySnapshot = await getDocs(q);
      this.users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data()['customer_email'],
        role: doc.data()['role']
      }));
      console.log('Filtered users (Admin/Staff only):', this.users);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Lỗi tải danh sách người dùng!');
    }
  }

  openAddUserPopup() {
    this.isAddUserPopupOpen = true;
  }

  closeAddUserPopup() {
    this.isAddUserPopupOpen = false;
    this.newUser = { email: '', role: 'Staff' };
  }

  async checkUserExists() {
    try {
      const customersCollection = collection(this.firestore, 'customers');
      const q = query(customersCollection, where('customer_email', '==', this.newUser.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        this.isAddUserPopupOpen = false;
        this.isConfirmPopupOpen = true;
      } else {
        alert('Email này không tồn tại trong hệ thống!');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      alert('Lỗi kiểm tra tài khoản!');
    }
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

  async updateUserRole() {
    try {
      const customersCollection = collection(this.firestore, 'customers');
      const q = query(customersCollection, where('customer_email', '==', this.newUser.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(this.firestore, `customers/${userDoc.id}`);
        await updateDoc(userRef, { role: this.newUser.role });
        alert('Cập nhật vai trò thành công!');
        this.loadUsers();
        this.newUser.email = '';
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Lỗi cập nhật vai trò!');
    }
  }

  async deleteUser(userId: string) {
    try {
      const userRef = doc(this.firestore, `customers/${userId}`);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        await updateDoc(userRef, { role: 'Customer' });
        alert('Xóa vai trò thành công!');
        this.loadUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Lỗi cập nhật vai trò!');
    }
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

  async updateSelectedUsersRole() {
    const selectedIds = Object.keys(this.selectedUsers).filter(id => this.selectedUsers[id]);
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng!');
      return;
    }

    try {
      for (const id of selectedIds) {
        const userRef = doc(this.firestore, `customers/${id}`);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          await updateDoc(userRef, { role: 'Customer' });
          console.log(`User ${id} updated to Customer`);
        }
      }
      alert('Xóa vai trò thành công!');
      this.loadUsers();
      this.selectedUsers = {};
      this.selectAll = false;
    } catch (error) {
      console.error('Error updating users:', error);
      alert('Lỗi cập nhật vai trò!');
    }
  }
}