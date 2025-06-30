import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-update',
  standalone: false,
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.css'],
  
})
export class OrderUpdateComponent implements OnInit {

  hasShownAlert: boolean = false;

  orderId!: string;

  productTotal: number = 0;
  shippingFee: number = 0;

  order: any = {
    id: '',
    customer: '',
    status: '',
    date: '',
    payment_method: '',
    total: 0,
    items: [],
    delivery: {
      receiver: '',
      phone: '',
      address: ''
    },
    customer_note: ''
  };

  cancelReason: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrderFromFirestore(this.orderId);
    }
  }

  async loadOrderFromFirestore(id: string) {
    try {
      const orderRef = doc(this.firestore, 'orders', id);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) return;

      const orderData = orderSnap.data();

      const formatTime = (field: any): string =>
        field instanceof Timestamp
          ? field.toDate().toLocaleString('vi-VN')
          : '';
      
      const shipTime = formatTime(orderData['ship_time']);
      const paymentTime = formatTime(orderData['payment_time']);
      const completeTime = formatTime(orderData['complete_time']);
      const cancelTime = formatTime(orderData['cancel_requested_at']);   

      // Định dạng thời gian đặt hàng
      let formattedDate = '';
      if (orderData['order_time'] instanceof Timestamp) {
        formattedDate = orderData['order_time'].toDate().toLocaleString('vi-VN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false
        });
      }

      // Lấy danh sách sản phẩm
      const items: any[] = [];
      let totalGoods = 0;

      const itemRef = doc(this.firestore, 'order_items', orderData['order_item_id']);
      const itemSnap = await getDoc(itemRef);
      if (itemSnap.exists()) {
        const itemData = itemSnap.data();
        for (const key of Object.keys(itemData)) {
          if (key.startsWith('product')) {
            const p = itemData[key];
        
            let productName = p.product_id;
            let productImage = 'https://via.placeholder.com/60';
            let listedPrice = 0;
        
            if (p.product_id) {
              const productRef = doc(this.firestore, 'products', p.product_id);
              const productSnap = await getDoc(productRef);
              if (productSnap.exists()) {
                const productData = productSnap.data();
                productName = productData['product_name'] || productName;
                productImage = productData['product_image'] || productImage;
                listedPrice = parseFloat(productData['price']) || 0;
              }
            }
        
            const quantity = parseFloat(p.quantity) || 0;
            const totalCostOfGoods = parseFloat(p.total_cost_of_goods) || 0;
            const actualUnitPrice =
              totalCostOfGoods > 0 && quantity > 0 ? totalCostOfGoods / quantity : listedPrice;
            
            const isDiscounted = actualUnitPrice < listedPrice;
            
            totalGoods += actualUnitPrice * quantity;
            
            items.push({
              product_id: p.product_id,
              name: productName,
              quantity: quantity,
              price: listedPrice,
              actual_unit_price: actualUnitPrice,
              image: productImage,
              original_quantity: quantity,
              isDiscounted: isDiscounted
            });            
          }
        }        
      }

      // Gán tổng sản phẩm và phí giao hàng
      this.productTotal = totalGoods;
      this.shippingFee = parseFloat(orderData['shipping_fee']) || 0;

      const newOrder: any = {
        id: this.orderId,
        customer: orderData['customer_name'] || '',
        status: orderData['order_status'],
        date: formattedDate,
        payment_method: orderData['payment_method'],
        total: 0,
        items: items,
        customer_note: orderData['customer_note'] || '',
        delivery: {
          receiver: '',
          phone: '',
          address: ''
        },
        ship_time: shipTime,
        payment_time: paymentTime,
        complete_time: completeTime,
        cancel_requested_at: cancelTime,
        cancel_requested_by: orderData['cancel_requested_by'] || ''
      };

      // Lấy thông tin giao hàng 
      const customerId = orderData['customer_id'];
      if (customerId) {
        try {
          const customerRef = doc(this.firestore, 'customers', customerId);
          const customerSnap = await getDoc(customerRef);
          if (customerSnap.exists()) {
            const customerData = customerSnap.data();
            newOrder.delivery = {
              receiver: customerData['customer_name'] || '',
              phone: customerData['phone_number'] || '',
              address: customerData['address'] || ''
            };
          }
        } catch (err) {
          console.warn('Error when getting customer information:', err);
        }
      }

      this.order = newOrder;
      this.cancelReason = orderData['cancel_reason'] || '';
      this.recalculateTotal();

    } catch (err) {
      console.error('Error when loading order:', err);
    }
  }

  recalculateTotal(): void {
    this.productTotal = this.order.items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.quantity) * (item.actual_unit_price !== item.price ? item.actual_unit_price : item.price),
      0
    );
  
    this.order.total = this.productTotal + Number(this.shippingFee || 0);
  }  
  
  async saveOrder(): Promise<void> {
    try {
      // Cập nhật tổng giá trị
      this.recalculateTotal();
  
      const orderRef = doc(this.firestore, 'orders', this.orderId);
  
      // Lấy đơn hàng gốc để kiểm tra trạng thái hiện tại
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) throw new Error("No order found.");
      const firestoreOrderData = orderSnap.data();
      const oldStatus = firestoreOrderData['order_status'];
      const newStatus = this.order.status;
  
      // Mapping thứ tự hợp lệ
      const statusOrder = ['Pending Payment', 'Shipped', 'Delivered', 'Completed'];
  
      // Kiểm tra thứ tự chuyển trạng thái 
      const oldIndex = statusOrder.indexOf(oldStatus);
      const newIndex = statusOrder.indexOf(newStatus);
  
      const isCancelled = newStatus === 'Cancelled';
  
      // Không được huỷ nếu đơn đã Completed
      if (isCancelled && oldStatus === 'Completed') {
        alert('Không thể huỷ đơn hàng đã hoàn tất.');
        return;
      }
  
      if (!isCancelled && newStatus !== oldStatus) {
        if (oldIndex === -1 || newIndex === -1 || newIndex !== oldIndex + 1) {
          alert(`Cannot change status from "${oldStatus}" to "${newStatus}".`);
          return;
        }
      }
  
      if (isCancelled && !this.cancelReason.trim()) {
        alert('Please enter reason for canceling order!');
        return;
      }
  
      // Dữ liệu cập nhật đơn hàng
      const updateData: any = {
        order_code: this.order.id,
        customer_name: this.order.customer,
        order_status: newStatus,
        order_value: this.productTotal + this.shippingFee
      };
  
      // Thêm timestamp theo trạng thái mới
      const now = new Date();
      switch (newStatus) {
        case 'Shipped':
          updateData['ship_time'] = now;
          break;
        case 'Delivered':
          updateData['payment_time'] = now;
          break;
        case 'Completed':
          updateData['complete_time'] = now;
          break;
          case 'Cancelled':
            updateData['cancel_requested_at'] = now;
            updateData['cancel_reason'] = this.cancelReason.trim();
            updateData['cancel_requested_by'] = 'admin';
            break;
      }
  
      await updateDoc(orderRef, updateData);

      // Xử lý tồn kho sau cập nhật trạng thái
      if (oldStatus === 'Pending Payment' && newStatus === 'Shipped') {
        // Trừ tồn kho khi đơn chuyển sang Shipped
        for (const item of this.order.items) {
          const productRef = doc(this.firestore, 'products', item.product_id);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const currentData = productSnap.data();
            const currentQty = Number(currentData['quantity']) || 0;
            const newQty = currentQty - Number(item.quantity);
            await updateDoc(productRef, { quantity: newQty >= 0 ? newQty : 0 });
          }
        }
      }

      // Cộng lại tồn kho nếu huỷ đơn từ trạng thái đã trừ hàng
      if (
        newStatus === 'Cancelled' &&
        (oldStatus === 'Shipped' || oldStatus === 'Delivered')
      ) {
        for (const item of this.order.items) {
          const productRef = doc(this.firestore, 'products', item.product_id);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const currentData = productSnap.data();
            const currentQty = Number(currentData['quantity']) || 0;
            const newQty = currentQty + Number(item.quantity);
            await updateDoc(productRef, { quantity: newQty });
          }
        }
      }

      // Điều chỉnh kho nếu quantity bị sửa trong lúc update
      if (
        oldStatus === newStatus &&
        ['Shipped', 'Delivered'].includes(oldStatus)
      ) {
        for (const item of this.order.items) {
          const originalQty = Number(item.original_quantity || 0);
          const newQty = Number(item.quantity);
          const delta = newQty - originalQty;
          if (delta !== 0) {
            const productRef = doc(this.firestore, 'products', item.product_id);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const currentQty = Number(productSnap.data()['quantity']) || 0;
              const updatedQty = currentQty - delta;
              await updateDoc(productRef, { quantity: Math.max(0, updatedQty) });
            }
          }
        }
      }
  
      // Cập nhật lại sản phẩm trong order_items
      const orderItemId = firestoreOrderData['order_item_id'];
      const orderItemRef = doc(this.firestore, 'order_items', orderItemId);
  
      // Chỉ cập nhật sản phẩm đã có, không tạo mới
      const updatedItems: any = {};
      this.order.items.forEach((item: any, index: number) => {
        const key = `product${index + 1}`;
      
        // Không cho phép cập nhật số lượng nếu sản phẩm đã giảm giá
        const updatedQty = item.isDiscounted ? item.original_quantity : Number(item.quantity);
        const unitPrice = item.actual_unit_price !== item.price ? item.actual_unit_price : item.price;
      
        updatedItems[key] = {
          product_id: item.product_id || item.name,
          quantity: updatedQty,
          total_cost_of_goods: updatedQty * unitPrice,
          rating: item.rating || '',
          comment: item.comment || ''
        };
      });      
  
      await updateDoc(orderItemRef, updatedItems);
  
      alert('Order updated successfully!');
      this.router.navigate(['/order']);
    } catch (err) {
      console.error('Error saving order:', err);
      alert('An error occurred while saving the order!');
    }
  }  

  getTotal(): number {
    return this.order.total;
  }

  warnIfDiscounted(isDiscounted: boolean): void {
    if (isDiscounted) {
      alert('⚠️ The product has been discounted, you cannot change the quantity!');
    }
  }
  
  showAlertIfDiscounted(isDiscounted: boolean): void {
    if (isDiscounted && !this.hasShownAlert) {
      this.hasShownAlert = true;
  
      this.snackBar.open(
        '⚠️ The product has been discounted, you cannot change the quantity!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        }
      );
  
      setTimeout(() => {
        this.hasShownAlert = false;
      }, 3000);
    }
  }  
   
}
