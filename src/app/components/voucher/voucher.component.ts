import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../services/voucher.service';
import { Voucher } from '../../model/voucher';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-voucher',
  standalone: false,
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
  isAddModalOpen = false;
  isEditModalOpen = false;

  startDateStr = '';
  endDateStr = '';
  editStartDateStr = '';
  editEndDateStr = '';

  newVoucher: Voucher = {
    code: '',
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    discount: 0,
    minOrderValue: 0,
    type: 'merchandise'
  };

  editedVoucher: Voucher = { ...this.newVoucher };
  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];

  constructor(private voucherService: VoucherService) {}

  ngOnInit() {
    this.loadVouchers();
  }

  loadVouchers() {
    this.voucherService.getVouchers().subscribe({
      next: (data) => {
        this.vouchers = data;
        this.filterVouchers();
      },
      error: (err) => console.error('Error loading vouchers:', err)
    });
  }

  detectVoucherType(discount: number): 'merchandise' | 'shipping' {
    return discount < 100 ? 'merchandise' : 'shipping';
  }

  getVoucherStatus(startDate: Timestamp, endDate: Timestamp): string {
    const now = Date.now();
    const start = startDate.toDate().getTime();
    const end = endDate.toDate().getTime();

    if (now < start) return 'scheduled';
    if (now >= start && now <= end) return 'active';
    return 'expired';
  }


  openAddModal() {
    this.startDateStr = '';
    this.endDateStr = '';
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  async addVoucher() {
    try {
      const start = new Date(this.startDateStr);
      const end = new Date(this.endDateStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error('Invalid date');

      const voucher: Voucher = {
        ...this.newVoucher,
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        type: this.detectVoucherType(this.newVoucher.discount)
      };

      await this.voucherService.addVoucher(voucher);
      this.loadVouchers();
      this.closeAddModal();
    } catch (err) {
      console.error('Lỗi khi thêm voucher:', err);
    }
  }

  editVoucher(index: number) {
    this.editedVoucher = { ...this.filteredVouchers[index] };
    this.editStartDateStr = this.timestampToInputStr(this.editedVoucher.startDate);
    this.editEndDateStr = this.timestampToInputStr(this.editedVoucher.endDate);
    this.isEditModalOpen = true;
  }

  timestampToInputStr(ts: Timestamp): string {
    const d = ts.toDate();
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }

  async updateVoucher() {
    try {
      const start = new Date(this.editStartDateStr);
      const end = new Date(this.editEndDateStr);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error('Invalid date');

      const updatedVoucher: Voucher = {
        ...this.editedVoucher,
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        type: this.detectVoucherType(this.editedVoucher.discount)
      };

      await this.voucherService.updateVoucher(updatedVoucher);
      this.loadVouchers();
      this.isEditModalOpen = false;
    } catch (err) {
      console.error('Lỗi khi cập nhật voucher:', err);
    }
  }

  async deleteVoucher(index: number) {
    const id = this.filteredVouchers[index]._id;
    if (id && confirm('Bạn có chắc muốn xóa?')) {
      await this.voucherService.deleteVoucher(id);
      this.loadVouchers();
    }
  }

  filterVouchers(event?: Event) {
  const status = event ? (event.target as HTMLSelectElement).value : 'all';

  this.filteredVouchers = this.vouchers.filter(voucher => {
    const voucherStatus = this.getVoucherStatus(voucher.startDate, voucher.endDate);
    return status === 'all' || voucherStatus === status;
  });
  }
}
