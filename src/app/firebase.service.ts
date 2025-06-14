import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

export interface Customer {
  customer_name: string;
  customer_email: string;
  phone_number: string;
  role: string;
  address: string;
  avatar_img: string;
  date_joined: string;
  dob: string;
  gender: string;
  customer_username: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: AngularFireDatabase) {}

  getCustomersData(): Observable<Customer[]> {
    const ref = this.db.list<Customer>('customers/customers');
    return ref.valueChanges();
  }

  addCustomer(customerData: Customer) {
    const ref = this.db.list('customers/customers');
    return ref.push(customerData);
  }

  updateCustomer(customerId: string, updatedData: Partial<Customer>) {
    const ref = this.db.object(`customers/customers/${customerId}`);
    return ref.update(updatedData);
  }
}