import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  getCustomersData(): Observable<any[]> {
    const customersCollection = collection(this.firestore, 'customers');
    return collectionData(customersCollection, { idField: '$key' }).pipe(
      map(customers => customers.map(customer => ({
        ...customer,
        $key: customer.$key
      })))
    );
  }

  async addCustomer(customerData: any): Promise<void> {
    const customersCollection = collection(this.firestore, 'customers');
    const newDocRef = doc(customersCollection);
    return setDoc(newDocRef, customerData);
  }

  async updateCustomer(customerId: string, updatedData: any): Promise<void> {
    const customerDoc = doc(this.firestore, `customers/${customerId}`);
    return updateDoc(customerDoc, updatedData);
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const customerDoc = doc(this.firestore, `customers/${customerId}`);
    return deleteDoc(customerDoc);
  }
}