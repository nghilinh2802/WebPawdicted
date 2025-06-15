import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFireDatabase) {}

  getCustomersData(): Observable<any[]> {
    return this.db.list('customers').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({
          $key: c.payload.key,
          ...(c.payload.val() as object || {})
        }))
      )
    );
  }

  addCustomer(customerData: any): Promise<any> {
    const ref = this.db.list('customers');
    return Promise.resolve(ref.push(customerData));
  }

  updateCustomer(customerId: string, updatedData: any): Promise<void> {
    const ref = this.db.object(`customers/${customerId}`);
    return ref.update(updatedData);
  }

  deleteCustomer(customerId: string): Promise<void> {
    const ref = this.db.object(`customers/${customerId}`);
    return ref.remove();
  }
}