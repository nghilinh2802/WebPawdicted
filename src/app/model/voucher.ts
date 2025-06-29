import { Timestamp } from 'firebase/firestore'; 

export interface Voucher {
  _id?: string;
  code: string;
  startDate: Timestamp;
  endDate: Timestamp;
  discount: number;
  minOrderValue: number;
  type: 'merchandise' | 'shipping';
}