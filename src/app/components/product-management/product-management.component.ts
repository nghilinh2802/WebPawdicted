import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';
import { FlashsaleService } from '../../services/flashsale.service';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Flashsale } from '../../model/flashsale';



@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent, ProductDetailsModalComponent],
  providers: [ProductService],
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products$: Observable<any[]>;
  filteredProducts: any[] = [];
  searchTerm: string = '';
  categoryFilter: string = '';
  variantFilter: string = '';
  sortFilter: string = '';
  selectedProductIds: Set<string> = new Set();
  selectedVariantIds: Set<string> = new Set();
  expandedProductIds: Set<string> = new Set();
  showAddModal = false;
  showEditModal = false;
  showDetailsModal = false;
  selectedProductId: string = '';

  categories = [
    { id: 'Food & Treats', name: 'Food & Treats', children: ['Dry Food', 'Wet Food', 'Treats'] },
    { id: 'Pet Care', name: 'Pet Care', children: ['Dental Care', 'Supplements & Vitamins', 'Flea & Tick Control', 'Shampoos & Conditioners', 'Brushes & Combs', 'Nail Care', 'Deodorant Tools'] },
    { id: 'Toys', name: 'Toys', children: ['Toys', 'Training'] },
    { id: 'Accessories', name: 'Accessories', children: ['Collars & Leashes', 'Apparel & Costume', 'Feeders'] },
    { id: 'Furniture', name: 'Furniture', children: ['Bedding', 'Crates, Houses & Pens'] },
    { id: 'Carriers & Kennels', name: 'Carriers & Kennels', children: ['Carriers', 'Kennels'] }
  ];
  
  constructor(private productService: ProductService,
    private flashsaleService: FlashsaleService,
    private firestore: Firestore,
) {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.products$.pipe(
      switchMap(products => {
        this.filteredProducts = products;
        const variantPromises = products.map(product =>
          this.productService.getVariants(product.product_id).pipe(take(1)).toPromise().then(variants => {
            product.variants = (variants ?? []).map(variant => ({
              ...variant,
              variant_price: variant.variant_price,
              variant_quantity: variant.variant_quantity
            }));
            return product;
          })
        );
        return Promise.all(variantPromises).then(() => this.applyFilters());
      })
    ).subscribe(() => {}, error => console.error('Error loading products:', error));
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedProductIds.clear();
    this.selectedVariantIds.clear();
    if (checked) {
      this.filteredProducts.forEach(product => {
        this.selectedProductIds.add(product.product_id);
        product.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
      });
    }
  }

  toggleProductSelection(productId: string): void {
    if (this.selectedProductIds.has(productId)) {
      this.selectedProductIds.delete(productId);
      const product = this.filteredProducts.find(p => p.product_id === productId);
      product?.variants?.forEach((variant: any) => this.selectedVariantIds.delete(variant.variant_id));
    } else {
      this.selectedProductIds.add(productId);
      const product = this.filteredProducts.find(p => p.product_id === productId);
      product?.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
    }
  }

  toggleVariantSelection(variantId: string): void {
    if (this.selectedVariantIds.has(variantId)) {
      this.selectedVariantIds.delete(variantId);
    } else {
      this.selectedVariantIds.add(variantId);
    }
  }

  async deleteSelected(): Promise<void> {
    if (!window.confirm('Are you sure you want to delete the selected products and variants? This action cannot be undone!')) {
      return;
    }
    try {
      // Lấy danh sách sản phẩm và biến thể hiện tại từ filteredProducts
      const productsMap = new Map(this.filteredProducts.map(product => [product.product_id, product.variants || []]));

      // Xóa biến thể trước
      for (const variantId of this.selectedVariantIds) {
        for (const [productId, variants] of productsMap) {
          const variant = variants.find((v: any) => v.variant_id === variantId);
          if (variant) {
            try {
              await this.productService.deleteVariant(variantId);
              // Cập nhật local state
              const product = this.filteredProducts.find(p => p.product_id === productId);
              if (product) {
                product.variants = product.variants.filter((v: any) => v.variant_id !== variantId);
              }
            } catch (variantError) {
              console.warn(`Failed to delete variant ${variantId}:`, variantError);
            }
            break; // Thoát khi tìm thấy và xử lý xong
          }
        }
      }

      // Xóa sản phẩm
      for (const productId of this.selectedProductIds) {
        try {
          await this.productService.deleteProduct(productId);
          this.filteredProducts = this.filteredProducts.filter(p => p.product_id !== productId);
          this.expandedProductIds.delete(productId);
        } catch (productError) {
          console.warn(`Failed to delete product ${productId}:`, productError);
          if (typeof productError === 'object' && productError !== null && 'code' in productError && (productError as any).code === 'not-found') {
            console.warn(`Product ${productId} not found in Firestore, removing from local list.`);
            this.filteredProducts = this.filteredProducts.filter(p => p.product_id !== productId);
            this.selectedProductIds.delete(productId);
            this.expandedProductIds.delete(productId);
          }
        }
      }

      // Clear selections and refresh
      this.selectedProductIds.clear();
      this.selectedVariantIds.clear();
      this.expandedProductIds.clear();
      this.products$ = this.productService.getProducts();
      this.ngOnInit();
    } catch (error) {
      console.error('Error in deleteSelected:', error);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    if (!window.confirm(`Are you sure you want to delete the product with ID ${productId}? This action cannot be undone!`)) {
      return;
    }
    try {
      await this.productService.deleteProduct(productId);
      this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
      this.selectedProductIds.delete(productId);
      this.expandedProductIds.delete(productId);
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'not-found') {
        console.warn(`Product ${productId} not found in Firestore, removing from local list.`);
        this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
        this.selectedProductIds.delete(productId);
        this.expandedProductIds.delete(productId);
      }
    }
  }

  applyFilters(): void {
    this.products$.pipe(
      map(products => {
        let filtered = products.filter(product =>
          (product.product_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
          (this.categoryFilter ? product.category_id === this.categoryFilter : true) &&
          (this.variantFilter === 'has_variant' ? product.variant_id.length > 0 :
           this.variantFilter === 'no_variant' ? product.variant_id.length === 0 : true)
        );

        if (this.sortFilter === 'name_asc') {
          filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        } else if (this.sortFilter === 'name_desc') {
          filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
        } else if (this.sortFilter === 'date_asc') {
          filtered.sort((a, b) => a.date_listed - b.date_listed);
        } else if (this.sortFilter === 'date_desc') {
          filtered.sort((a, b) => b.date_listed - a.date_listed);
        }

        return filtered.map(product => ({
          ...product,
          variants: product.variants || []
        }));
      })
    ).subscribe(filtered => {
      this.filteredProducts = filtered;
    }, error => console.error('Error applying filters:', error));
  }
  // ===== FLASHSALE SECTION - UPDATED =====
  showFlashsalePopup = false;
  productMaxQuantities: Map<string, number> = new Map();
  
  flashsaleForm = {
    flashSale_id: '',
    flashSale_name: '',
    startTime: 0,
    endTime: 0,
    discountRate: 0,
    soldQuantity: 0,
    product_id: [] as string[]
  };

  openFlashsalePopup() {
    // Khởi tạo maxQuantity mặc định cho các sản phẩm được chọn
    this.selectedProductIds.forEach(productId => {
      if (!this.productMaxQuantities.has(productId)) {
        this.productMaxQuantities.set(productId, 100); // Giá trị mặc định
      }
    });

    this.flashsaleForm = {
      flashSale_id: uuidv4(),
      flashSale_name: '',
      startTime: Date.now(),
      endTime: Date.now() + 3600000,
      discountRate: 10,
      soldQuantity: 0,
      product_id: Array.from(this.selectedProductIds)
    };
    this.showFlashsalePopup = true;
  }

  closeFlashsalePopup() {
    this.showFlashsalePopup = false;
    this.productMaxQuantities.clear(); // Clear maxQuantities khi đóng popup
  }

  async createFlashsale() {
    console.log('✅ createFlashsale() được gọi');
    const confirmed = confirm('Bạn có chắc chắn muốn tạo flashsale này không?');
    if (!confirmed) {
      console.log('🚫 User huỷ tạo flashsale.');
      return;
    }

    const flashRef = collection(this.firestore, 'flashsales');

    const newFlash = {
      flashSale_id: this.flashsaleForm.flashSale_id || 'fs_' + Date.now(),
      flashSale_name: this.flashsaleForm.flashSale_name,
      startTime: this.flashsaleForm.startTime,
      endTime: this.flashsaleForm.endTime,
      discountRate: this.flashsaleForm.discountRate,
      products: Array.from(this.selectedProductIds).map(pid => ({
        product_id: pid,
        discountRate: this.flashsaleForm.discountRate,
        unitSold: 0,
        maxQuantity: this.productMaxQuantities.get(pid) || 100 // Lấy maxQuantity riêng cho từng sản phẩm
      }))
    };

    try {
      await addDoc(flashRef, newFlash);
      alert('✅ Flashsale created!');

      // ✅ Reset lại form an toàn
      this.flashsaleForm = {
        flashSale_id: '',
        flashSale_name: '',
        startTime: 0,
        endTime: 0,
        discountRate: 0,
        soldQuantity: 0,
        product_id: []
      };

      this.selectedProductIds.clear();
      this.productMaxQuantities.clear(); // Clear maxQuantities
      this.showFlashsalePopup = false;

    } catch (error) {
      console.error('❌ Firestore error:', error);
      alert('Failed to create flashsale');
    }
  }

  // Thêm method để lấy tên sản phẩm
  getProductName(productId: string): string {
    const product = this.filteredProducts.find(p => p.product_id === productId);
    return product ? product.product_name : productId;
  }
  // ===== END FLASHSALE SECTION =====




  getDateTimeLocal(timestamp: number): string {
    const date = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  getTimestampFromLocal(dateTimeString: string): number {
    return new Date(dateTimeString).getTime();
  }

  openAddModal() {
    this.showAddModal = true;
  }

  openEditModal(productId: string) {
    this.selectedProductId = productId;
    this.showEditModal = true;
  }

  openDetailsModal(productId: string) {
    this.selectedProductId = productId;
    this.showDetailsModal = true;
  }

  toggleVariants(productId: string) {
    if (this.expandedProductIds.has(productId)) {
      this.expandedProductIds.delete(productId);
      const product = this.filteredProducts.find(p => p.product_id === productId);
      if (product) product.variants = [];
    } else {
      this.expandedProductIds.add(productId);
      const product = this.filteredProducts.find(p => p.product_id === productId);
      if (product && product.variant_id?.length > 0 && !product.variants.length) {
        this.productService.getVariants(productId).pipe(take(1)).subscribe(variants => {
          product.variants = variants.map(v => ({
            variant_id: v.variant_id,
            quantity: v.variant_quantity || 0,
            price: v.variant_price || 0,
            image: v.variant_image || 'https://via.placeholder.com/60',
            variant_name: v.variant_name || ''
          }));
        });
      }
    }
  }
}