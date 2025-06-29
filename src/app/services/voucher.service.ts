import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Voucher } from '../model/voucher';
import { Timestamp } from 'firebase/firestore'; 

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private vouchersCollection: any;

  constructor(private firestore: Firestore) {
    this.vouchersCollection = collection(this.firestore, 'vouchers');
  }

  getVouchers(): Observable<Voucher[]> {
    return collectionData(this.vouchersCollection, { idField: '_id' }).pipe(
    map((vouchers: any[]) =>
      vouchers.map(v => ({
        ...v,
        startDate: v.startDate?.toDate ? v.startDate : Timestamp.fromDate(new Date(v.startDate)),
        endDate: v.endDate?.toDate ? v.endDate : Timestamp.fromDate(new Date(v.endDate))
      }))
    )
  );
  }

  async addVoucher(voucher: Voucher): Promise<void> {
    const newDocRef = doc(this.vouchersCollection);
    return setDoc(newDocRef, voucher);
  }

  async updateVoucher(voucher: Voucher): Promise<void> {
    if (!voucher._id) throw new Error('Voucher ID is required for updating.');
    const voucherDoc = doc(this.firestore, `vouchers/${voucher._id}`);
    const { _id, ...voucherData } = voucher;
    return updateDoc(voucherDoc, voucherData);
  }

  async deleteVoucher(id: string): Promise<void> {
    const voucherDoc = doc(this.firestore, `vouchers/${id}`);
    return deleteDoc(voucherDoc);
  }
}
