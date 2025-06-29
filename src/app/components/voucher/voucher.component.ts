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
  selectedVoucherIndex: number | null = null;

  newVoucher: Voucher = {
    code: '',
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    discount: 0,
    minOrderValue: 0,
    type: 'merchandise'
  };

  editedVoucher: Voucher = {
    code: '',
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    discount: 0,
    minOrderValue: 0,
    type: 'merchandise'
  };

  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];

  startDateStr: string = '';
  endDateStr: string = '';
  editStartDateStr: string = '';
  editEndDateStr: string = '';

  constructor(private voucherService: VoucherService) {}

  ngOnInit() {
    this.loadVouchers();
  }

  loadVouchers() {
    this.voucherService.getVouchers().subscribe({
      next: (data: Voucher[]) => {
        this.vouchers = data;
        this.filterVouchers();
      },
      error: (error: any) => console.error('Lỗi khi tải danh sách voucher:', error)
    });
  }

  openAddModal() {
    this.isAddModalOpen = true;
    this.startDateStr = '';
    this.endDateStr = '';
    this.resetForm();
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  editVoucher(i: number) {
    this.selectedVoucherIndex = i;
    const voucher = this.filteredVouchers[i];
    this.editedVoucher = { ...voucher };
    this.editStartDateStr = voucher.startDate.toDate().toISOString().slice(0, 16);
    this.editEndDateStr = voucher.endDate.toDate().toISOString().slice(0, 16);
    this.isEditModalOpen = true;
  }

  async addVoucher() {
    if (!this.validateVoucher(this.newVoucher)) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      this.newVoucher.startDate = Timestamp.fromDate(new Date(this.startDateStr));
      this.newVoucher.endDate = Timestamp.fromDate(new Date(this.endDateStr));
      await this.voucherService.addVoucher(this.newVoucher);
      this.loadVouchers();
      this.isAddModalOpen = false;
    } catch (error) {
      console.error('Lỗi khi thêm voucher:', error);
    }
  }

  async updateVoucher() {
    if (!this.editedVoucher._id) return;
    try {
      this.editedVoucher.startDate = Timestamp.fromDate(new Date(this.editStartDateStr));
      this.editedVoucher.endDate = Timestamp.fromDate(new Date(this.editEndDateStr));
      await this.voucherService.updateVoucher(this.editedVoucher);
      this.loadVouchers();
      this.isEditModalOpen = false;
    } catch (error) {
      console.error('Lỗi khi cập nhật voucher:', error);
    }
  }

  async deleteVoucher(index: number) {
    const voucherToDelete = this.filteredVouchers[index];
    if (!voucherToDelete || !voucherToDelete._id) {
      console.error('Không tìm thấy voucher để xóa!');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      try {
        await this.voucherService.deleteVoucher(voucherToDelete._id);
        this.loadVouchers(); // Load lại để đồng bộ
      } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
        alert('Xóa thất bại! Vui lòng thử lại.');
      }
    }
  }

  validateVoucher(voucher: Voucher): boolean {
    return voucher.code.trim() !== '' &&
      this.startDateStr !== '' &&
      this.endDateStr !== '' &&
      voucher.discount !== null &&
      voucher.minOrderValue !== null;
  }

  resetForm() {
    this.newVoucher = {
      code: '',
      startDate: Timestamp.now(),
      endDate: Timestamp.now(),
      discount: 0,
      minOrderValue: 0,
      type: 'merchandise'
    };
  }

  getVoucherStatus(start: Timestamp, end: Timestamp): string {
    const now = new Date().getTime();
    const startMs = start.toDate().getTime();
    const endMs = end.toDate().getTime();
    if (now < startMs) return 'scheduled';
    if (now >= startMs && now <= endMs) return 'active';
    return 'expired';
  }

  filterVouchers(event?: Event) {
    const status = event ? (event.target as HTMLSelectElement).value : 'all';

    this.filteredVouchers = this.vouchers
      .filter(voucher => {
        const voucherStatus = this.getVoucherStatus(voucher.startDate, voucher.endDate);
        return status === 'all' || voucherStatus === status;
      })
      .sort((a, b) => a.type.localeCompare(b.type)); // Sort by type
  }
}
