import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule để dùng ngModel

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, FormsModule], // Thêm FormsModule
  template: `
    <div class="container">
      <h2>Customer List</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let customer of customers">
            <td>{{ customer.customer_name }}</td>
            <td>{{ customer.customer_username }}</td>
            <td>{{ customer.customer_email }}</td>
            <td>{{ customer.phone_number }}</td>
            <td>
              <button (click)="editCustomer(customer)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Form chỉnh sửa -->
      <div *ngIf="editingCustomer" class="edit-form">
        <h3>Edit Customer</h3>
        <form (ngSubmit)="saveCustomer()">
          <label>Name:</label>
          <input [(ngModel)]="editingCustomer.customer_name" name="name" required />
          <label>Username:</label>
          <input [(ngModel)]="editingCustomer.customer_username" name="username" required />
          <label>Email:</label>
          <input [(ngModel)]="editingCustomer.customer_email" name="email" type="email" required />
          <label>Phone:</label>
          <input [(ngModel)]="editingCustomer.phone_number" name="phone" required />
          <button type="submit">Save</button>
          <button type="button" (click)="cancelEdit()">Cancel</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      .edit-form {
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 5px;
      }
      label {
        display: block;
        margin-top: 10px;
      }
      input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      button {
        margin-top: 10px;
        padding: 8px 16px;
        margin-right: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button[type='submit'] {
        background-color: #4caf50;
        color: white;
      }
      button[type='button'] {
        background-color: #f44336;
        color: white;
      }
    `
  ]
})
export class DataComponent implements OnInit {
  customers: any[] = [];
  editingCustomer: any = null;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    // Lấy danh sách khách hàng
    this.dbService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        console.log('Customers loaded:', customers);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  }

  // Bắt đầu chỉnh sửa khách hàng
  editCustomer(customer: any) {
    this.editingCustomer = { ...customer }; // Sao chép để tránh thay đổi trực tiếp
  }

  // Lưu thông tin khách hàng
  async saveCustomer() {
    if (this.editingCustomer) {
      const { id, ...data } = this.editingCustomer; // Tách ID khỏi dữ liệu
      try {
        await this.dbService.updateCustomer(id, data);
        this.editingCustomer = null; // Đóng form
        console.log('Customer updated');
      } catch (error) {
        console.error('Error saving customer:', error);
      }
    }
  }

  // Hủy chỉnh sửa
  cancelEdit() {
    this.editingCustomer = null;
  }
}