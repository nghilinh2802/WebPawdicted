import { Injectable, NgZone } from '@angular/core';
import { Database, ref, set, get, child, onValue, update } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private db: Database, private ngZone: NgZone) {}

  // Ghi dữ liệu vào Firebase Realtime Database
  async writeData(path: string, data: any): Promise<void> {
    const dbRef = ref(this.db, path);
    try {
      await this.ngZone.runOutsideAngular(() => set(dbRef, data));
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing data:', error);
      throw error;
    }
  }

  // Đọc dữ liệu một lần
  async readData(path: string): Promise<any> {
    const dbRef = ref(this.db);
    try {
      const snapshot = await this.ngZone.runOutsideAngular(() => get(child(dbRef, path)));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error reading data:', error);
      throw error;
    }
  }

  // Lắng nghe thay đổi dữ liệu theo thời gian thực
  listenData(path: string): Observable<any> {
    const dbRef = ref(this.db, path);
    return new Observable((subscriber) => {
      onValue(dbRef, (snapshot) => {
        this.ngZone.run(() => {
          const data = snapshot.val();
          subscriber.next(data);
        });
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  // Lấy danh sách khách hàng
  getCustomers(): Observable<any[]> {
    return new Observable((subscriber) => {
      const customersRef = ref(this.db, 'customers/customers');
      onValue(customersRef, (snapshot) => {
        this.ngZone.run(() => {
          const customersData = snapshot.val();
          if (customersData) {
            // Chuyển dữ liệu thành mảng với ID
            const customersArray = Object.keys(customersData).map((key) => ({
              id: key,
              ...customersData[key]
            }));
            subscriber.next(customersArray);
          } else {
            subscriber.next([]);
          }
        });
      }, (error) => {
        subscriber.error(error);
      });
    });
  }

  // Cập nhật thông tin khách hàng
  async updateCustomer(customerId: string, data: any): Promise<void> {
    const customerRef = ref(this.db, `customers/customers/${customerId}`);
    try {
      await this.ngZone.runOutsideAngular(() => update(customerRef, data));
      console.log('Customer updated successfully');
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

   // Kiểm tra đăng nhập admin
  async loginAdmin(email: string, password: string): Promise<any> {
    const dbRef = ref(this.db);
    try {
      const snapshot = await this.ngZone.runOutsideAngular(() => get(child(dbRef, 'customers/customers')));
      if (snapshot.exists()) {
        const users = snapshot.val();
        // Tìm người dùng khớp email, password, và role
        const user = Object.values(users).find((u: any) => 
          u.customer_email === email && 
          u.password === password && 
          u.role === 'Admin'
        );
        if (user) {
          return user; // Trả về thông tin người dùng
        } else {
          throw new Error('Invalid email, password, or not an admin');
        }
      } else {
        throw new Error('No users found');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }
}