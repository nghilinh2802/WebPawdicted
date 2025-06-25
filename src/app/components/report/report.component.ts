import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

interface Order {
  id: string;
  order_code: string;
  order_status: string;
  order_value: number;
  order_time: Timestamp;
  payment_method: string;
  customer_id: string;
  order_item_id?: string;
}

interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private firestore = inject(Firestore);
  orders: Order[] = [];
  orderItems: Map<string, OrderItem[]> = new Map();
  isLoading = true;
  selectedTimeFilter: string = '7days';
  customStartDate: string = '';
  customEndDate: string = '';

  // Statistics
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0
  };

  // Revenue Table
  revenueTable: { date: Date, orders: number, products: number, revenue: number }[] = [];

  // Line Chart
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Revenue (VNĐ)' } } },
    plugins: { legend: { display: false } }
  };
  lineChartType: ChartType = 'line';

  // Pie Chart
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };
  pieChartType: ChartType = 'pie';

  async ngOnInit() {
    try {
      await this.loadOrders();
      this.applyFilter();
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadOrders() {
    console.log('Loading orders from Firestore...');
    const ordersSnapshot = await getDocs(collection(this.firestore, 'orders'));
    console.log('Orders snapshot size:', ordersSnapshot.size);

    const orderPromises = ordersSnapshot.docs.map(async docSnap => {
      const data: any = docSnap.data();
      console.log('Order data:', docSnap.id, data);

      const orderDate = data['order_time'] instanceof Timestamp
        ? data['order_time']
        : Timestamp.fromDate(new Date());

      // Load order items
      let items: OrderItem[] = [];
      if (data['order_item_id']) {
        const itemDoc = await getDoc(doc(this.firestore, 'order_items', data['order_item_id']));
        console.log('Order items for', data['order_item_id'], itemDoc.exists() ? itemDoc.data() : 'Not found');
        if (itemDoc.exists()) {
          items = itemDoc.data()['items'] || [];
        }
      }

      const order: Order = {
        id: docSnap.id,
        order_code: data['order_code'] || '',
        order_status: data['order_status'] || 'Unknown',
        order_value: data['order_value'] || 0,
        order_time: orderDate,
        payment_method: data['payment_method'] || '',
        customer_id: data['customer_id'] || '',
        order_item_id: data['order_item_id']
      };
      this.orderItems.set(order.id, items);
      return order;
    });

    this.orders = await Promise.all(orderPromises);
    console.log('Loaded orders:', this.orders);
    console.log('Order items map:', this.orderItems);
  }

  applyFilter() {
    console.log('Applying filter:', this.selectedTimeFilter);
    let startDate: Date;
    let endDate = new Date();
    if (this.selectedTimeFilter === '7days') {
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (this.selectedTimeFilter === '30days') {
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = this.customStartDate ? new Date(this.customStartDate) : endDate;
      endDate = this.customEndDate ? new Date(this.customEndDate) : endDate;
    }

    // Filter orders
    const filteredOrders = this.orders.filter(order => {
      const orderDate = order.order_time.toDate();
      return orderDate >= startDate && orderDate <= endDate;
    });
    console.log('Filtered orders:', filteredOrders.length);

    // Calculate stats
    this.stats.totalProducts = filteredOrders.reduce((sum, order) => {
      const items = this.orderItems.get(order.id) || [];
      return sum + items.reduce((s, item) => s + item.quantity, 0);
    }, 0);
    this.stats.totalOrders = filteredOrders.length;
    this.stats.completedOrders = filteredOrders.filter(o => o.order_status === 'Completed').length;
    this.stats.cancelledOrders = filteredOrders.filter(o => o.order_status === 'Cancelled').length;
    this.stats.totalRevenue = filteredOrders
      .filter(o => o.order_status === 'Completed')
      .reduce((sum, order) => sum + order.order_value, 0);
    console.log('Stats:', this.stats);

    // Revenue table
    this.revenueTable = [];
    const dateMap = new Map<string, { orders: number, products: number, revenue: number }>();
    filteredOrders.forEach(order => {
      const dateStr = order.order_time.toDate().toISOString().split('T')[0];
      const current = dateMap.get(dateStr) || { orders: 0, products: 0, revenue: 0 };
      current.orders += 1;
      const items = this.orderItems.get(order.id) || [];
      current.products += items.reduce((s, item) => s + item.quantity, 0);
      current.revenue += order.order_status === 'Completed' ? order.order_value : 0;
      dateMap.set(dateStr, current);
    });
    dateMap.forEach((value, key) => {
      this.revenueTable.push({ date: new Date(key), ...value });
    });
    this.revenueTable.sort((a, b) => a.date.getTime() - b.date.getTime());
    console.log('Revenue table:', this.revenueTable);

    // Line chart data
    this.lineChartData = {
      labels: this.revenueTable.map(entry => entry.date.toLocaleDateString('en-GB')),
      datasets: [{
        data: this.revenueTable.map(entry => entry.revenue),
        borderColor: '#9c162c',
        backgroundColor: 'rgba(156, 22, 44, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
    console.log('Line chart data:', this.lineChartData);

    // Pie chart data
    type OrderStatus = 'Pending Payment' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';
    const statusCounts: Record<OrderStatus, number> = {
      'Pending Payment': 0,
      Shipped: 0,
      Delivered: 0,
      Completed: 0,
      Cancelled: 0
    };
    filteredOrders.forEach(order => {
      if (['Pending Payment', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].includes(order.order_status)) {
        statusCounts[order.order_status as OrderStatus] = (statusCounts[order.order_status as OrderStatus] || 0) + 1;
      }
    });
    this.pieChartData = {
      labels: Object.keys(statusCounts).filter(key => statusCounts[key as OrderStatus] > 0),
      datasets: [{
        data: Object.keys(statusCounts).filter(key => statusCounts[key as OrderStatus] > 0).map(key => statusCounts[key as OrderStatus]),
        backgroundColor: ['#ff4757', '#4CAF50', '#2196F3', '#ffd700', '#757575']
      }]
    };
    console.log('Pie chart data:', this.pieChartData);
  }

  exportReport() {
    console.log('Exporting report:', {
      stats: this.stats,
      revenueTable: this.revenueTable
    });
  }
}