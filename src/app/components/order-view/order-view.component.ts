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
  
      console.log('🧾 orderData:', orderData);
      console.log('🔍 order_status:', orderData['order_status']);
  
      // Lấy ghi chú khách hàng
      this.customerNote = orderData['customer_note'] || '[Không có ghi chú]';
  
      // Lấy thông tin khách hàng từ địa chỉ cụ thể
      let customerInfo: any = {
        name: '[Không rõ tên]',
        phone: '[Không rõ số]',
        address: '[Không rõ địa chỉ]'
      };

      try {
        if (orderData['customer_id'] && orderData['address_id']) {
          const addressItemRef = doc(
            this.firestore,
            'addresses',
            orderData['customer_id'],
            'items',
            orderData['address_id']
          );
          const addressSnap = await getDoc(addressItemRef);

          if (addressSnap.exists()) {
            const addressData = addressSnap.data();
            customerInfo = {
              name: addressData['name'] || customerInfo.name,
              phone: addressData['phone'] || customerInfo.phone,
              address: addressData['address'] || customerInfo.address
            };
          }
        }

        // Nếu không có thông tin địa chỉ cụ thể, fallback sang bảng customers
        if (
          customerInfo.name === '[Không rõ tên]' &&
          orderData['customer_id']
        ) {
          const customerRef = doc(this.firestore, 'customers', orderData['customer_id']);
          const customerSnap = await getDoc(customerRef);
          if (customerSnap.exists()) {
            const customerData = customerSnap.data();
            customerInfo = {
              name: customerData['customer_name'] || customerInfo.name,
              phone: customerData['phone_number'] || customerInfo.phone,
              address: customerData['address'] || customerInfo.address
            };
          }
        }
      } catch (error) {
        console.warn('Lỗi khi lấy thông tin khách hàng:', error);
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
            let unitPrice = 0; // giá niêm yết
  
            if (productSnap.exists()) {
              const productData = productSnap.data();
              productName = productData['product_name'] || p.product_id;
              productImage = productData['product_image'] || productImage;
              unitPrice = parseFloat(productData['price']) || 0;
            }
  
            const rating = p.rating || '';
            const comment = p.comment || '';
  
            // Tính giá thực tế
            let actualUnitPrice = 0;
            if (p.total_cost_of_goods && p.quantity) {
              actualUnitPrice = Number(p.total_cost_of_goods) / Number(p.quantity);
            }
  
            products.push({
              name: productName,
              quantity: p.quantity,
              image: productImage,
              rating: rating,
              comment: comment,
              unit_price: unitPrice,
              actual_unit_price: actualUnitPrice
            });
          }
        }
      }
  
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

  // ĐÃ BỎ HÀM getTotal()

  async updateProductRating(orderItemRef: any, orderItemData: any) {
    try {
      const productId = orderItemData['product_id'];
      console.log('productId: ', productId);

      const productRef = doc(this.firestore, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();

        const currentAverageRating = parseFloat(productData['average_rating']) || 0;
        const currentRatingNumber = productData['rating_number'] || 0;
        const newRating = parseFloat(orderItemData['rating']) || 0;

        const newAverageRating = (currentAverageRating * currentRatingNumber + newRating) / (currentRatingNumber + 1);
        const newRatingNumber = currentRatingNumber + 1;

        await updateDoc(productRef, {
          average_rating: newAverageRating,
          rating_number: newRatingNumber
        });

        console.log('Cập nhật rating thành công!');
      } else {
        console.log('Sản phẩm không tồn tại trong Firestore');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật rating của sản phẩm:', error);
    }
  }
}
