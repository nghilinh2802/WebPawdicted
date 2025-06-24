import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Flashsale } from '../../model/flashsale';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-flashsale',
  standalone: false,
  templateUrl: './flashsale.component.html',
  styleUrl: './flashsale.component.css'
})
export class FlashsaleManagementComponent implements OnInit {
  flashsales: Flashsale[] = [];
  filteredFlashsales: Flashsale[] = [];
  searchTerm: string = '';
  showEditPopup = false;
  editingFlashsale: Flashsale | null = null;

  constructor(private firestore: Firestore,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadFlashsales();
    this.loadAllProducts();
    console.log('allProducts:', this.allProducts);
  }

  loadFlashsales() {
    const flashRef = collection(this.firestore, 'flashsales');
    collectionData(flashRef, { idField: 'docId' }).subscribe((data: any) => {
      this.flashsales = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    const term = this.searchTerm?.toLowerCase() || '';
    this.filteredFlashsales = this.flashsales.filter(f => {
      const id = f.flashSale_id ? f.flashSale_id.toLowerCase() : '';
      const name = f.flashSale_name ? f.flashSale_name.toLowerCase() : '';
      return id.includes(term) || name.includes(term);
    });
  }

  openEditPopup(flash: Flashsale) {
    this.editingFlashsale = {
      ...flash,
      products: flash.products || []
    };
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
    this.editingFlashsale = null;
  }

  async deleteFlashsale(flash: Flashsale) {
    const confirmDelete = confirm(`Delete flashsale: ${flash.flashSale_name}?`);
    if (!confirmDelete) return;
    try {
      const docRef = doc(this.firestore, 'flashsales/' + flash.docId);
      await deleteDoc(docRef);
      this.loadFlashsales();
      alert('Flashsale deleted!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete flashsale!');
    }
  }

  getDateTimeLocal(timestamp: number): string {
    const date = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  getTimestampFromLocal(dateTimeString: string): number {
    return new Date(dateTimeString).getTime();
  }

  editingProductIds: string = '';

  editFlashsale(flashsale: Flashsale) {
    this.editingFlashsale = { ...flashsale };
    this.editingProductIds = flashsale.products.map(p => p.product_id).join(', ');
  }

  cancelEdit() {
    this.editingFlashsale = null;
    this.editingProductIds = '';
  }

  async saveFlashsale() {
    if (!this.editingFlashsale) return;
    const confirmEdit = confirm('Bạn có chắc chắn muốn lưu thay đổi cho flashsale này không?');
    if (!confirmEdit) {
      console.log('🚫 Người dùng huỷ lưu flashsale.');
      return;
    }

    try {
      this.editingFlashsale.discountRate = Math.max(
        ...this.editingFlashsale.products.map(p => p.discountRate)
      );
      const { flashSale_id, docId, ...updateData } = this.editingFlashsale!;
      const docRef = doc(this.firestore, `flashsales/${docId}`);
      await updateDoc(docRef, updateData);
      alert('Flashsale updated!');
      this.editingFlashsale = null;
      this.loadFlashsales();
    } catch (e) {
      console.error('Error updating flashsale:', e);
      alert('Failed to update flashsale');
    }
  }

  productSearch: string = '';
  filteredProductSuggestions: any[] = [];
  allProducts: any[] = [];

  loadAllProducts() {
    this.productService.loadProducts().subscribe(products => {
      this.allProducts = products;
    });
  }

  removeProduct(productId: string) {
    if (!this.editingFlashsale) return;
    this.editingFlashsale.products = this.editingFlashsale.products.filter(
      p => p.product_id !== productId
    );
  }

  filterProductSuggestions() {
    const keyword = this.productSearch.toLowerCase().trim();
    if (!keyword || !this.allProducts) {
      this.filteredProductSuggestions = [];
      return;
    }

    this.filteredProductSuggestions = this.allProducts
      .filter(p =>
        (p.product_name?.toLowerCase().includes(keyword) || p.product_id?.toLowerCase().includes(keyword)) &&
        !this.editingFlashsale!.products.some(existing => existing.product_id === p.product_id)
      )
      .slice(0, 5);
  }

  // ✅ SỬA LẠI HÀM NÀY - THÊM maxQuantity
  addProductToFlashsale(productId: string) {
    if (!this.editingFlashsale) return;
    const exists = this.editingFlashsale.products.some(p => p.product_id === productId);
    if (!exists) {
      const defaultRate = this.editingFlashsale.discountRate || 10;
      this.editingFlashsale.products.push({
        product_id: productId,
        discountRate: defaultRate,
        unitSold: 0,
        maxQuantity: 100  // ✅ THÊM maxQuantity với giá trị mặc định
      });
    }

    this.productSearch = '';
    this.filteredProductSuggestions = [];
  }

  // ✅ THÊM HÀM LẤY TÊN SẢN PHẨM
  getProductName(productId: string): string {
    const product = this.allProducts.find(p => p.product_id === productId);
    return product ? product.product_name : productId;
  }

  expandedFlashsaleIds: Set<string> = new Set();

  toggleFlashsaleExpand(flashSaleId: string) {
    if (this.expandedFlashsaleIds.has(flashSaleId)) {
      this.expandedFlashsaleIds.delete(flashSaleId);
    } else {
      this.expandedFlashsaleIds.add(flashSaleId);
    }
  }
}
