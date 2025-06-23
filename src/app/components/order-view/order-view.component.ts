import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-order-view',
  standalone: false,
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  orderId!: string;

  order: any = null;
  address: any = null;
  items: any[] = [];
  productTotal: number = 0;
  customerNote: string = '';

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.loadOrderDetail();
  }

  async loadOrderDetail() {
    try {
      const orderRef = doc(this.firestore, 'orders', this.orderId);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) return;
  
      const orderData = orderSnap.data();
  
      // Lấy ghi chú khách hàng
      this.customerNote = orderData['customer_note'] || '[Không có ghi chú]';
  
      // Lấy thông tin khách hàng từ bảng customers
      let customerInfo: any = {
        name: '[Không rõ tên]',
        phone: '[Không rõ số]',
        address: '[Không rõ địa chỉ]'
      };
  
      if (orderData['customer_id']) {
        const customerRef = doc(this.firestore, 'customers', orderData['customer_id']);
        const customerSnap = await getDoc(customerRef);
        if (customerSnap.exists()) {
          const customerData = customerSnap.data();
          customerInfo = {
            name: customerData['customer_name'] || '[Không rõ tên]',
            phone: customerData['phone_number'] || '[Không rõ số]',
            address: customerData['address'] || '[Không rõ địa chỉ]'
          };
        }
      }
  
      // Thời gian đặt hàng
      let orderDate = '';
      if (orderData['order_time'] instanceof Timestamp) {
        orderDate = orderData['order_time'].toDate().toLocaleString('vi-VN');
      }
  
      // Load sản phẩm từ collection `order_items`
      const orderItemRef = doc(this.firestore, 'order_items', orderData['order_item_id']);
      const orderItemSnap = await getDoc(orderItemRef);
      const products: any[] = [];
      let totalGoods = 0;
  
      if (orderItemSnap.exists()) {
        const itemData = orderItemSnap.data();
        for (const key of Object.keys(itemData)) {
          if (key.startsWith('product')) {
            const p = itemData[key];
  
            // Lấy thông tin sản phẩm từ bảng products
            const productRef = doc(this.firestore, 'products', p.product_id);
            const productSnap = await getDoc(productRef);
  
            let productName = p.product_id;
            let productImage = 'https://via.placeholder.com/60';
            let unitPrice = 0;
  
            if (productSnap.exists()) {
              const productData = productSnap.data();
              productName = productData['product_name'] || p.product_id;
              productImage = productData['product_image'] || productImage;
              unitPrice = parseFloat(productData['price']) || 0;
            }
  
            const totalCost = unitPrice * Number(p.quantity);
            totalGoods += totalCost;
  
            products.push({
              name: productName,
              quantity: p.quantity,
              price: unitPrice,
              total_cost: totalCost,
              image: productImage
            });
          }
        }
      }
  
      this.productTotal = totalGoods;

      // Tính tổng cộng và cập nhật lại order_value vào Firestore
      const shipping = parseFloat(orderData['shipping_fee']) || 0;
      const totalOrderValue = this.productTotal + shipping;
      
      await updateDoc(orderRef, {
        order_value: totalOrderValue
      });
        
      // Định dạng các thời điểm
      const formatTime = (field: any): string =>
        field instanceof Timestamp ? field.toDate().toLocaleString('vi-VN') : '';
  
      this.order = {
        id: orderData['order_code'],
        status: orderData['order_status'],
        payment_method: orderData['payment_method'],
        value: orderData['order_value'],
        shipping_fee: orderData['shipping_fee'] || 0,
        date: orderDate,
        ship_time: formatTime(orderData['ship_time']),
        payment_time: formatTime(orderData['payment_time']),
        complete_time: formatTime(orderData['complete_time']),
        cancel_requested_at: formatTime(orderData['cancel_requested_at']),
        cancel_reason: orderData['cancel_reason'] || '',
        cancel_requested_by: orderData['cancel_requested_by'] || '',
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address
      };
  
      this.items = products;
    } catch (error) {
      console.error('Lỗi tải chi tiết đơn hàng:', error);
    }
  }  

  getTotal(): number {
    const value = this.order?.value || 0;
    const shipping = this.order?.shipping_fee || 0;
    return value + shipping;
  }
}
