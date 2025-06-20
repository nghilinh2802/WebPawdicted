import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Voucher } from '../model/voucher';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private vouchersCollection: any; // Khai báo trước, gán giá trị trong constructor

  constructor(private firestore: Firestore) {
    this.vouchersCollection = collection(this.firestore, 'vouchers');
  }

  getVouchers(): Observable<Voucher[]> {
    return collectionData(this.vouchersCollection, { idField: '_id' }).pipe(
      map(vouchers => vouchers as Voucher[])
    );
  }

  async addVoucher(voucher: Voucher): Promise<void> {
    const newDocRef = doc(this.vouchersCollection);
    return setDoc(newDocRef, voucher);
  }

  async updateVoucher(voucher: Voucher): Promise<void> {
    if (!voucher._id) {
      throw new Error('Voucher ID is required for updating.');
    }
    const voucherDoc = doc(this.firestore, `vouchers/${voucher._id}`);
    const { _id, ...voucherData } = voucher; // Loại bỏ _id khỏi dữ liệu cập nhật
    return updateDoc(voucherDoc, voucherData);
  }

  async deleteVoucher(id: string): Promise<void> {
    const voucherDoc = doc(this.firestore, `vouchers/${id}`);
    return deleteDoc(voucherDoc);
  }
}