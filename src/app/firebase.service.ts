// src/app/firebase.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import operator map

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase) {}

  /**
   * Lấy tất cả dữ liệu khách hàng từ Firebase Realtime Database, bao gồm cả key.
   * Dữ liệu được đọc từ node 'customers/customers'.
   * @returns Observable chứa một mảng dữ liệu khách hàng, mỗi khách hàng có thuộc tính $key.
   */
  getCustomersData() {
    return this.db.list('/customers');
  }

  /**
   * Thêm dữ liệu khách hàng mới vào Firebase.
   * @param customerData Dữ liệu của khách hàng mới.
   * @returns Promise trả về khi dữ liệu đã được thêm thành công.
   */
  addCustomer(customerData: any): Promise<any> {
    const ref = this.db.list('customers/customers');
    return Promise.resolve(ref.push(customerData));
  }

  /**
   * Cập nhật dữ liệu của một khách hàng hiện có.
   * @param customerId ID ($key) của khách hàng cần cập nhật.
   * @param updatedData Dữ liệu cập nhật cho khách hàng.
   * @returns Promise trả về khi dữ liệu đã được cập nhật thành công.
   */
  updateCustomer(customerId: string, updatedData: any): Promise<void> {
    const ref = this.db.object('customers/customers/' + customerId);
    return ref.update(updatedData);
  }

  /**
   * Xóa dữ liệu của một khách hàng.
   * @param customerId ID ($key) của khách hàng cần xóa.
   * @returns Promise trả về khi dữ liệu đã được xóa thành công.
   */
  deleteCustomer(customerId: string): Promise<void> {
    const ref = this.db.object('customers/customers/' + customerId);
    return ref.remove();
  }
}
