import { Component } from '@angular/core';

@Component({
  selector: 'app-order-view',
  standalone: false,
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent {
  order = {
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    status: 'Pending',
    date: '2025-06-18',
    items: [
      {
        name: 'Áo thun mèo',
        quantity: 2,
        price: 250000,
        image: 'https://via.placeholder.com/60'
      },
      {
        name: 'Balo cún',
        quantity: 1,
        price: 350000,
        image: 'https://via.placeholder.com/60'
      }
    ]
  };

  getTotal() {
    return this.order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
