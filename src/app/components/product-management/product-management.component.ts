import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { NgModule } from '@angular/core';

// Ensure modal components are imported in the standalone component
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { EditVariantModalComponent } from '../edit-variant-modal/edit-variant-modal.component';
import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent,  ProductDetailsModalComponent],
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
  showAddModal = false;
  showEditModal = false;
  showDetailsModal = false;
  selectedProductId: string = '';

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.products$.subscribe(products => {
      this.filteredProducts = products;
      this.applyFilters();
    });
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
    } else {
      this.selectedProductIds.add(productId);
    }
  }

  toggleVariantSelection(variantId: string): void {
    if (this.selectedVariantIds.has(variantId)) {
      this.selectedVariantIds.delete(variantId);
    } else {
      this.selectedVariantIds.add(variantId);
    }
  }

  // Delete the selected products
  async deleteSelected(): Promise<void> {
    for (const productId of this.selectedProductIds) {
      await this.productService.deleteProduct(productId);
    }
    for (const variantId of this.selectedVariantIds) {
      await this.productService.deleteVariant(variantId);
    }
    this.selectedProductIds.clear();
    this.selectedVariantIds.clear();
  }

  // Delete a single product
  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId)
      .then(() => {
        this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
      });
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
          variants: this.productService.getVariants(product.product_id)
        }));
      })
    ).subscribe(filtered => this.filteredProducts = filtered);
  }

  createFlashsale(): void {
    alert('Chức năng tạo flashsale đang được phát triển!');
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
    // Handle toggling variant visibility here
  }
}
