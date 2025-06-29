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

      console.log('🧾 orderData:', orderData);
      console.log('🔍 order_status:', orderData['order_status']);
  
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

            const rating = p.rating || '';
            const comment = p.comment || '';
  
            products.push({
              name: productName,
              quantity: p.quantity,
              price: unitPrice,
              total_cost: totalCost,
              image: productImage,
              rating: rating,
              comment: comment
            });
  
            // Cập nhật `total_cost_of_goods` cho từng sản phẩm trong `order_items`
            const productKey = key; // Lấy key product
            await updateDoc(orderItemRef, {
              [productKey]: {
                ...p,
                total_cost_of_goods: totalCost  // Cập nhật total_cost_of_goods vào order_items
              }
            });
          }
        }
      }
  
      this.productTotal = totalGoods;
  
      // Tính tổng cộng và cập nhật `total_cost_of_goods` và `order_value` vào bảng `orders`
      const shipping = parseFloat(orderData['shipping_fee']) || 0;
      const totalOrderValue = this.productTotal + shipping;
  
      // Cập nhật `order_value` vào bảng `orders`
      await updateDoc(orderRef, {
        order_value: totalOrderValue  // Lưu giá trị tổng đơn hàng vào bảng `orders`
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

  async updateProductRating(orderItemRef: any, orderItemData: any) {
    try {
      // Lấy product_id từ order_item
      const productId = orderItemData['product_id'];
      console.log('productId: ', productId);  // Debug: kiểm tra productId
  
      // Lấy thông tin sản phẩm từ Firestore
      const productRef = doc(this.firestore, 'products', productId);
      const productSnap = await getDoc(productRef);
  
      if (productSnap.exists()) {
        const productData = productSnap.data();
  
        // Lấy giá trị hiện tại của average_rating và rating_number
        const currentAverageRating = parseFloat(productData['average_rating']) || 0;
        const currentRatingNumber = productData['rating_number'] || 0;
  
        // Debug: In giá trị hiện tại
        console.log('Current average rating:', currentAverageRating);
        console.log('Current rating number:', currentRatingNumber);
  
        // Lấy giá trị rating từ order_item (được nạp từ client)
        const newRating = parseFloat(orderItemData['rating']) || 0;
  
        // Debug: In rating mới
        console.log('New rating:', newRating);
  
        // Tính toán average_rating mới
        const newAverageRating = (currentAverageRating * currentRatingNumber + newRating) / (currentRatingNumber + 1);
  
        // Debug: In giá trị newAverageRating
        console.log('New average rating:', newAverageRating);
  
        // Cập nhật rating_number (tăng thêm 1)
        const newRatingNumber = currentRatingNumber + 1;
  
        // Debug: In giá trị newRatingNumber
        console.log('New rating number:', newRatingNumber);
  
        // Cập nhật lại giá trị average_rating và rating_number vào bảng `products`
        await updateDoc(productRef, {
          average_rating: newAverageRating,  // Cập nhật average_rating mới
          rating_number: newRatingNumber     // Cập nhật rating_number mới
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
