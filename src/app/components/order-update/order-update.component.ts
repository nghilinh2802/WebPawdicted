import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-update',
  standalone: false,
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.css']
})
export class OrderUpdateComponent implements OnInit {
  order = {
    id: '',
    customer: '',
    status: 'Pending',
    date: '',
    total: 0,
    items: [
      { name: 'Áo thun mèo', quantity: 2, price: 250000, image: 'https://via.placeholder.com/64' },
      { name: 'Balo cún', quantity: 1, price: 350000, image: 'https://via.placeholder.com/64' }
    ]
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Giả lập lấy dữ liệu từ API/backend
      this.order.id = id;
      this.recalculateTotal();
    }
  }

  getTotal() {
    return this.order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  recalculateTotal(): void {
    this.order.total = this.order.items.reduce(
      (sum, item) => sum + item.quantity * item.price, 0
    );
  }

  saveOrder(): void {
    this.recalculateTotal();
    console.log('Đã lưu đơn hàng:', this.order);
    // TODO: Gửi dữ liệu đến backend tại đây
    alert('Cập nhật đơn hàng thành công!');
    this.router.navigate(['/order']);
  }
}
