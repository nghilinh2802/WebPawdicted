export interface Voucher {
  _id?: string;
  code: string;
  startDate: string;
  endDate: string;
  discount: number;
  minOrderValue: number;
}