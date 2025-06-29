import { Component, inject, OnInit} from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs} from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { deleteDoc } from '@angular/fire/firestore';

interface Order {
  id: string;
  code: string;
  status: string;
  value: number;
  date: string;
  payment_method: string;
  customer_name: string;
}

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  searchText = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;
  selectedOrderIds: string[] = [];

  firestore = inject(Firestore);

  async ngOnInit(): Promise<void> {
    const ordersSnapshot = await getDocs(collection(this.firestore, 'orders'));

    // Sắp xếp theo thời gian giảm dần (mới nhất trên cùng)
    const sortedDocs = ordersSnapshot.docs.sort((a, b) => {
      const timeA = a.data()['order_time']?.toDate?.() ?? new Date(0);
      const timeB = b.data()['order_time']?.toDate?.() ?? new Date(0);
      return timeB.getTime() - timeA.getTime(); 
    });
  
    const orderPromises = sortedDocs.map(async docSnap => {
      const data: any = docSnap.data();
  
      let customerName = '[Không rõ]';

      try {
        if (data.customer_id && data.address_id) {
          const addressItemRef = doc(this.firestore, 'addresses', data.customer_id, 'items', data.address_id);
          const addressItemSnap = await getDoc(addressItemRef);
          if (addressItemSnap.exists()) {
            const addressData = addressItemSnap.data();
            if (addressData['name']) {
              customerName = addressData['name'];
              }
            }
          }         
      
        // Nếu không tìm được tên từ address, fallback sang customer
        if (customerName === '[Không rõ]' && data.customer_id) {
          const customerRef = doc(this.firestore, 'customers', data.customer_id);
          const customerSnap = await getDoc(customerRef);
          if (customerSnap.exists()) {
            const customerData = customerSnap.data();
            if (customerData['customer_name']) {
              customerName = customerData['customer_name'];
            }
          }
        }
      } catch (error) {
        console.warn('Lỗi khi truy xuất customer_name:', error);
      }     

      const orderDate = data['order_time'] instanceof Timestamp
      ? data['order_time'].toDate().toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : '';

      return {
        id: docSnap.id,
        code: docSnap.id, 
        status: data['order_status'] || '',
        value: data['order_value'] || 0,
        date: orderDate,
        payment_method: data['payment_method'] || '',
        customer_name: customerName
      } as Order;
    });

    this.orders = await Promise.all(orderPromises);
    // this.isLoading = false;
  }

  get filteredOrders() {
    return this.orders.filter(order =>
      (this.selectedStatus === '' || order.status === this.selectedStatus) &&
      (this.searchText === '' ||
        order.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  // Tổng số trang sau lọc
  get totalPages() {
    return Math.ceil(this.filteredOrders.length / this.pageSize);
  }

  // Danh sách đơn trong trang hiện tại
  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  // Chỉ số dòng cuối đang hiển thị
  get endItemIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredOrders.length);
  }

  // Chuyển sang trang tiếp theo
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // Quay lại trang trước
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Xử lý chọn/xoá nhiều đơn hàng

  // Kiểm tra đơn hàng có đang được chọn không
  isSelected(id: string): boolean {
    return this.selectedOrderIds.includes(id);
  }

  // Tick/Bỏ tick từng đơn hàng
  toggleOrderSelection(id: string) {
    const index = this.selectedOrderIds.indexOf(id);
    if (index > -1) this.selectedOrderIds.splice(index, 1);
    else this.selectedOrderIds.push(id);
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
        if (!this.isSelected(order.id)) this.selectedOrderIds.push(order.id);
      });
    } else {
      this.paginatedOrders.forEach(order => {
        const index = this.selectedOrderIds.indexOf(order.id);
        if (index > -1) this.selectedOrderIds.splice(index, 1);
      });
    }
  }

  // Xoá các đơn hàng đã chọn
  async deleteSelectedOrders() {
    const confirmed = confirm('Bạn có chắc chắn muốn xóa các đơn hàng đã chọn?');
    if (!confirmed) return;
  
    for (const id of this.selectedOrderIds) {
      try {
        // Xoá đơn hàng chính
        await deleteDoc(doc(this.firestore, 'orders', id));
  
        // Lấy order_item_id để xoá dữ liệu trong order_items
        const orderDoc = await getDoc(doc(this.firestore, 'orders', id));
        const itemId = orderDoc.exists() ? orderDoc.data()['order_item_id'] : null;
        if (itemId) {
          await deleteDoc(doc(this.firestore, 'order_items', itemId));
        }
  
      } catch (err) {
        console.error('Lỗi khi xóa đơn hàng hoặc order_items:', id, err);
      }
    }
  
    // Xoá trên giao diện
    this.orders = this.orders.filter(order => !this.selectedOrderIds.includes(order.id));
    this.selectedOrderIds = [];
    this.currentPage = 1;
  }

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      // Đảo chiều nếu đang cùng cột
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Chọn cột mới, mặc định tăng dần
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  } 

}
