import { Component } from '@angular/core';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  // Danh sách đơn hàng mẫu
  orders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', status: 'Pending', total: 1500000, date: '2025-06-18' },
    { id: 'ORD002', customer: 'Trần Thị B', status: 'Shipped', total: 2300000, date: '2025-06-17' },
    { id: 'ORD003', customer: 'Lê Văn C', status: 'Delivered', total: 800000, date: '2025-06-16' },
    { id: 'ORD004', customer: 'Phạm Văn D', status: 'Pending', total: 1600000, date: '2025-06-15' },
    { id: 'ORD005', customer: 'Ngô Thị E', status: 'Shipped', total: 1900000, date: '2025-06-14' },
    { id: 'ORD006', customer: 'Hoàng Văn F', status: 'Delivered', total: 1200000, date: '2025-06-13' },
    { id: 'ORD007', customer: 'Đặng Thị G', status: 'Pending', total: 1000000, date: '2025-06-12' },
  ];

  // Tìm kiếm & lọc
  searchText: string = '';
  selectedStatus: string = '';

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 5;

  // Danh sách đơn hàng được chọn để xoá
  selectedOrderIds: string[] = [];

  // Lọc dữ liệu theo từ khoá & trạng thái
  get filteredOrders() {
    return this.orders.filter(order =>
      (this.selectedStatus === '' || order.status === this.selectedStatus) &&
      (this.searchText === '' || order.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
        order.customer.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  // Tổng số trang sau lọc
  get totalPages() {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  // Danh sách đơn trong trang hiện tại
  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders.slice(start, end);
  }

  // Chỉ số dòng cuối đang hiển thị
  get endItemIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredOrders.length);
  }

  // Chuyển sang trang tiếp theo
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Quay lại trang trước
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Xử lý chọn/xoá nhiều đơn hàng

  // Kiểm tra đơn hàng có đang được chọn không
  isSelected(id: string): boolean {
    return this.selectedOrderIds.includes(id);
  }

  // Tick/Bỏ tick từng đơn hàng
  toggleOrderSelection(id: string) {
    const index = this.selectedOrderIds.indexOf(id);
    if (index > -1) {
      this.selectedOrderIds.splice(index, 1);
    } else {
      this.selectedOrderIds.push(id);
    }
  }

  // Kiểm tra đã chọn hết đơn trong trang chưa
  get allSelected(): boolean {
    return this.paginatedOrders.every(order => this.isSelected(order.id));
  }

  // Tick chọn toàn bộ hoặc bỏ chọn trong trang hiện tại
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.paginatedOrders.forEach(order => {
        if (!this.isSelected(order.id)) {
          this.selectedOrderIds.push(order.id);
        }
      });
    } else {
      this.paginatedOrders.forEach(order => {
        const index = this.selectedOrderIds.indexOf(order.id);
        if (index > -1) {
          this.selectedOrderIds.splice(index, 1);
        }
      });
    }
  }

  // Xoá các đơn hàng đã chọn
  deleteSelectedOrders() {
    const confirmed = confirm('Bạn có chắc chắn muốn xóa các đơn hàng đã chọn?');
    if (confirmed) {
      this.orders = this.orders.filter(order => !this.selectedOrderIds.includes(order.id));
      this.selectedOrderIds = [];
      this.currentPage = 1;
    }
  }
}
