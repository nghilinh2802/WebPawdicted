import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoucherService } from '../../services/voucher.service';
import { Voucher } from '../../model/voucher';

@Component({
  standalone: false,
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],

})
export class VoucherComponent implements OnInit {
  isAddModalOpen = false;
  isEditModalOpen = false;
  selectedVoucherIndex: number | null = null;

  newVoucher: Voucher = {
    code: '',
    startDate: '',
    endDate: '',
    discount: 0,
    minOrderValue: 0
  };

  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];
  editedVoucher: Voucher = { code: '', startDate: '', endDate: '', discount: 0, minOrderValue: 0 };

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

  getVoucherStatus(startDate: string, endDate: string): string {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) return 'scheduled';
    if (now >= start && now <= end) return 'active';
    return 'expired';
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    this.resetForm();
  }

  async addVoucher() {
    if (this.validateVoucher(this.newVoucher)) {
      try {
        await this.voucherService.addVoucher(this.newVoucher);
        this.loadVouchers();
        this.closeAddModal();
      } catch (error: any) {
        console.error('Lỗi khi thêm voucher:', error);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  editVoucher(i: number) {
    this.selectedVoucherIndex = i;
    this.editedVoucher = { ...this.filteredVouchers[i] };
    this.isEditModalOpen = true;
  }

  async updateVoucher() {
    if (!this.editedVoucher._id) {
      console.error("Không tìm thấy ID của voucher để cập nhật!");
      return;
    }

    try {
      await this.voucherService.updateVoucher(this.editedVoucher);
      this.loadVouchers();
      this.isEditModalOpen = false;
    } catch (error: any) {
      console.error("Lỗi khi cập nhật voucher:", error);
    }
  }

  async deleteVoucher(index: number) {
    const voucherToDelete = this.vouchers[index];

    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      try {
        await this.voucherService.deleteVoucher(voucherToDelete._id!);
        this.loadVouchers();
      } catch (error: any) {
        console.error('Lỗi khi xóa voucher:', error);
        alert('Xóa thất bại! Vui lòng thử lại.');
      }
    }
  }

  validateVoucher(voucher: Voucher): boolean {
    return voucher.code.trim() !== '' &&
           voucher.startDate !== '' &&
           voucher.endDate !== '' &&
           voucher.discount !== null &&
           voucher.minOrderValue !== null;
  }

  resetForm() {
    this.newVoucher = { code: '', startDate: '', endDate: '', discount: 0, minOrderValue: 0 };
    this.selectedVoucherIndex = null;
  }

  filterVouchers(event?: Event) {
    const status = event ? (event.target as HTMLSelectElement).value : 'all';

    this.filteredVouchers = this.vouchers.filter(voucher => {
      const voucherStatus = this.getVoucherStatus(voucher.startDate, voucher.endDate);
      return status === 'all' || voucherStatus === status;
    });
  }
}