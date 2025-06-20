// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { CommonModule } from '@angular/common';  // Import CommonModule
// import { FormsModule } from '@angular/forms';  // Import FormsModule
// import { NgModule } from '@angular/core';

// // Ensure modal components are imported in the standalone component
// import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
// import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
// import { EditVariantModalComponent } from '../edit-variant-modal/edit-variant-modal.component';
// import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

// @Component({
//   selector: 'app-product-management',
//   templateUrl: './product-management.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent,  ProductDetailsModalComponent],
//   providers: [ProductService],
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products$: Observable<any[]>;
//   filteredProducts: any[] = [];
//   searchTerm: string = '';
//   categoryFilter: string = '';
//   variantFilter: string = '';
//   sortFilter: string = '';
//   selectedProductIds: Set<string> = new Set();
//   selectedVariantIds: Set<string> = new Set();
//   showAddModal = false;
//   showEditModal = false;
//   showDetailsModal = false;
//   selectedProductId: string = '';

//   constructor(private productService: ProductService) {
//     this.products$ = this.productService.getProducts();
//   }

//   ngOnInit(): void {
//     this.products$.subscribe(products => {
//       this.filteredProducts = products;
//       this.applyFilters();
//     });
//   }

//   toggleSelectAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//     if (checked) {
//       this.filteredProducts.forEach(product => {
//         this.selectedProductIds.add(product.product_id);
//         product.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
//       });
//     }
//   }

//   toggleProductSelection(productId: string): void {
//     if (this.selectedProductIds.has(productId)) {
//       this.selectedProductIds.delete(productId);
//     } else {
//       this.selectedProductIds.add(productId);
//     }
//   }

//   toggleVariantSelection(variantId: string): void {
//     if (this.selectedVariantIds.has(variantId)) {
//       this.selectedVariantIds.delete(variantId);
//     } else {
//       this.selectedVariantIds.add(variantId);
//     }
//   }

//   // Delete the selected products
//   async deleteSelected(): Promise<void> {
//     for (const productId of this.selectedProductIds) {
//       await this.productService.deleteProduct(productId);
//     }
//     for (const variantId of this.selectedVariantIds) {
//       await this.productService.deleteVariant(variantId);
//     }
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//   }

//   // Delete a single product
//   deleteProduct(productId: string): void {
//     this.productService.deleteProduct(productId)
//       .then(() => {
//         this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
//       });
//   }

//   applyFilters(): void {
//     this.products$.pipe(
//       map(products => {
//         let filtered = products.filter(product =>
//           (product.product_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//            product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
//           (this.categoryFilter ? product.category_id === this.categoryFilter : true) &&
//           (this.variantFilter === 'has_variant' ? product.variant_id.length > 0 :
//            this.variantFilter === 'no_variant' ? product.variant_id.length === 0 : true)
//         );

//         if (this.sortFilter === 'name_asc') {
//           filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
//         } else if (this.sortFilter === 'name_desc') {
//           filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
//         } else if (this.sortFilter === 'date_asc') {
//           filtered.sort((a, b) => a.date_listed - b.date_listed);
//         } else if (this.sortFilter === 'date_desc') {
//           filtered.sort((a, b) => b.date_listed - a.date_listed);
//         }

//         return filtered.map(product => ({
//           ...product,
//           variants: this.productService.getVariants(product.product_id)
//         }));
//       })
//     ).subscribe(filtered => this.filteredProducts = filtered);
//   }

//   createFlashsale(): void {
//     alert('Chức năng tạo flashsale đang được phát triển!');
//   }

//   openAddModal() {
//     this.showAddModal = true;
//   }

//   openEditModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showEditModal = true;
//   }

//   openDetailsModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showDetailsModal = true;
//   }

//   toggleVariants(productId: string) {
//     // Handle toggling variant visibility here
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
// import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
// import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

// @Component({
//   selector: 'app-product-management',
//   templateUrl: './product-management.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent, ProductDetailsModalComponent],
//   providers: [ProductService],
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products$: Observable<any[]>;
//   filteredProducts: any[] = [];
//   searchTerm: string = '';
//   categoryFilter: string = '';
//   variantFilter: string = '';
//   sortFilter: string = '';
//   selectedProductIds: Set<string> = new Set();
//   selectedVariantIds: Set<string> = new Set();
//   expandedProductIds: Set<string> = new Set();
//   showAddModal = false;
//   showEditModal = false;
//   showDetailsModal = false;
//   selectedProductId: string = '';

//   constructor(private productService: ProductService) {
//     this.products$ = this.productService.getProducts();
//   }

//   ngOnInit(): void {
//     this.products$.subscribe(products => {
//       this.filteredProducts = products;
//       this.applyFilters();
//     });
//   }

//   toggleSelectAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//     if (checked) {
//       this.filteredProducts.forEach(product => {
//         this.selectedProductIds.add(product.product_id);
//         product.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
//       });
//     }
//   }

//   toggleProductSelection(productId: string): void {
//     if (this.selectedProductIds.has(productId)) {
//       this.selectedProductIds.delete(productId);
//     } else {
//       this.selectedProductIds.add(productId);
//     }
//   }

//   toggleVariantSelection(variantId: string): void {
//     if (this.selectedVariantIds.has(variantId)) {
//       this.selectedVariantIds.delete(variantId);
//     } else {
//       this.selectedVariantIds.add(variantId);
//     }
//   }

//   async deleteSelected(): Promise<void> {
//     for (const productId of this.selectedProductIds) {
//       await this.productService.deleteProduct(productId);
//     }
//     for (const variantId of this.selectedVariantIds) {
//       await this.productService.deleteVariant(variantId);
//     }
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//   }

//   deleteProduct(productId: string): void {
//     this.productService.deleteProduct(productId)
//       .then(() => {
//         this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
//       });
//   }

//   applyFilters(): void {
//     this.products$.pipe(
//       map(products => {
//         let filtered = products.filter(product =>
//           (product.product_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//            product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
//           (this.categoryFilter ? product.category_id === this.categoryFilter : true) &&
//           (this.variantFilter === 'has_variant' ? product.variant_id.length > 0 :
//            this.variantFilter === 'no_variant' ? product.variant_id.length === 0 : true)
//         );

//         if (this.sortFilter === 'name_asc') {
//           filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
//         } else if (this.sortFilter === 'name_desc') {
//           filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
//         } else if (this.sortFilter === 'date_asc') {
//           filtered.sort((a, b) => a.date_listed - b.date_listed);
//         } else if (this.sortFilter === 'date_desc') {
//           filtered.sort((a, b) => b.date_listed - a.date_listed);
//         }

//         return filtered.map(product => ({
//           ...product,
//           variants: product.variants || []
//         }));
//       })
//     ).subscribe(filtered => {
//       this.filteredProducts = filtered;
//       this.expandedProductIds.forEach(productId => {
//         const product = this.filteredProducts.find(p => p.product_id === productId);
//         if (product && !product.variants.length) {
//           this.productService.getVariants(productId).subscribe(variants => {
//             product.variants = variants;
//           });
//         }
//       });
//     });
//   }

//   createFlashsale(): void {
//     alert('Chức năng tạo flashsale đang được phát triển!');
//   }

//   openAddModal() {
//     this.showAddModal = true;
//   }

//   openEditModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showEditModal = true;
//   }

//   openDetailsModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showDetailsModal = true;
//   }

//   toggleVariants(productId: string) {
//     if (this.expandedProductIds.has(productId)) {
//       this.expandedProductIds.delete(productId);
//       const product = this.filteredProducts.find(p => p.product_id === productId);
//       if (product) product.variants = [];
//     } else {
//       this.expandedProductIds.add(productId);
//       const product = this.filteredProducts.find(p => p.product_id === productId);
//       if (product && product.variant_id?.length > 0 && !product.variants.length) {
//         this.productService.getVariants(productId).subscribe(variants => {
//           product.variants = variants;
//         });
//       }
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
// import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
// import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

// @Component({
//   selector: 'app-product-management',
//   templateUrl: './product-management.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent, ProductDetailsModalComponent],
//   providers: [ProductService],
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products$: Observable<any[]>;
//   filteredProducts: any[] = [];
//   searchTerm: string = '';
//   categoryFilter: string = '';
//   variantFilter: string = '';
//   sortFilter: string = '';
//   selectedProductIds: Set<string> = new Set();
//   selectedVariantIds: Set<string> = new Set();
//   expandedProductIds: Set<string> = new Set();
//   showAddModal = false;
//   showEditModal = false;
//   showDetailsModal = false;
//   selectedProductId: string = '';

//   constructor(private productService: ProductService) {
//     this.products$ = this.productService.getProducts();
//   }

//   ngOnInit(): void {
//     this.products$.subscribe(products => {
//       this.filteredProducts = products;
//       this.applyFilters();
//     });
//   }

//   toggleSelectAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//     if (checked) {
//       this.filteredProducts.forEach(product => {
//         this.selectedProductIds.add(product.product_id);
//         product.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
//       });
//     }
//   }

//   toggleProductSelection(productId: string): void {
//     if (this.selectedProductIds.has(productId)) {
//       this.selectedProductIds.delete(productId);
//     } else {
//       this.selectedProductIds.add(productId);
//     }
//   }

//   toggleVariantSelection(variantId: string): void {
//     if (this.selectedVariantIds.has(variantId)) {
//       this.selectedVariantIds.delete(variantId);
//     } else {
//       this.selectedVariantIds.add(variantId);
//     }
//   }

//   async deleteSelected(): Promise<void> {
//     for (const productId of this.selectedProductIds) {
//       await this.productService.deleteProduct(productId);
//     }
//     for (const variantId of this.selectedVariantIds) {
//       await this.productService.deleteVariant(variantId);
//     }
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//   }

//   deleteProduct(productId: string): void {
//     this.productService.deleteProduct(productId)
//       .then(() => {
//         this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
//       });
//   }

//   applyFilters(): void {
//     this.products$.pipe(
//       map(products => {
//         let filtered = products.filter(product =>
//           (product.product_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//            product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
//           (this.categoryFilter ? product.category_id === this.categoryFilter : true) &&
//           (this.variantFilter === 'has_variant' ? product.variant_id.length > 0 :
//            this.variantFilter === 'no_variant' ? product.variant_id.length === 0 : true)
//         );

//         if (this.sortFilter === 'name_asc') {
//           filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
//         } else if (this.sortFilter === 'name_desc') {
//           filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
//         } else if (this.sortFilter === 'date_asc') {
//           filtered.sort((a, b) => a.date_listed - b.date_listed);
//         } else if (this.sortFilter === 'date_desc') {
//           filtered.sort((a, b) => b.date_listed - a.date_listed);
//         }

//         return filtered.map(product => ({
//           ...product,
//           variants: product.variants || []
//         }));
//       })
//     ).subscribe(filtered => {
//       this.filteredProducts = filtered;
//       this.expandedProductIds.forEach(productId => {
//         const product = this.filteredProducts.find(p => p.product_id === productId);
//         if (product && !product.variants.length) {
//           this.productService.getVariants(productId).subscribe(variants => {
//             product.variants = variants;
//           });
//         }
//       });
//     });
//   }

//   createFlashsale(): void {
//     alert('Chức năng tạo flashsale đang được phát triển!');
//   }

//   openAddModal() {
//     this.showAddModal = true;
//   }

//   openEditModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showEditModal = true;
//   }

//   openDetailsModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showDetailsModal = true;
//   }

//   toggleVariants(productId: string) {
//     if (this.expandedProductIds.has(productId)) {
//       this.expandedProductIds.delete(productId);
//       const product = this.filteredProducts.find(p => p.product_id === productId);
//       if (product) product.variants = [];
//     } else {
//       this.expandedProductIds.add(productId);
//       const product = this.filteredProducts.find(p => p.product_id === productId);
//       if (product && product.variant_id?.length > 0 && !product.variants.length) {
//         this.productService.getVariants(productId).subscribe(variants => {
//           product.variants = variants;
//         });
//       }
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { Observable } from 'rxjs';
// import { map, switchMap } from 'rxjs/operators';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
// import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
// import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

// @Component({
//   selector: 'app-product-management',
//   templateUrl: './product-management.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent, ProductDetailsModalComponent],
//   providers: [ProductService],
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products$: Observable<any[]>;
//   filteredProducts: any[] = [];
//   searchTerm: string = '';
//   categoryFilter: string = '';
//   variantFilter: string = '';
//   sortFilter: string = '';
//   selectedProductIds: Set<string> = new Set();
//   selectedVariantIds: Set<string> = new Set();
//   expandedProductIds: Set<string> = new Set();
//   showAddModal = false;
//   showEditModal = false;
//   showDetailsModal = false;
//   selectedProductId: string = '';

//   constructor(private productService: ProductService) {
//     this.products$ = this.productService.getProducts();
//   }

//   ngOnInit(): void {
//     this.products$.pipe(
//       switchMap(products => {
//         this.filteredProducts = products;
//         const variantPromises = products.map(product =>
//           this.productService.getVariants(product.product_id).toPromise().then(variants => {
//             product.variants = variants;
//             return product;
//           })
//         );
//         return Promise.all(variantPromises).then(() => this.applyFilters());
//       })
//     ).subscribe(() => {});
//   }

//   toggleSelectAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//     if (checked) {
//       this.filteredProducts.forEach(product => {
//         this.selectedProductIds.add(product.product_id);
//         product.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
//       });
//     }
//   }

//   toggleProductSelection(productId: string): void {
//     if (this.selectedProductIds.has(productId)) {
//       this.selectedProductIds.delete(productId);
//     } else {
//       this.selectedProductIds.add(productId);
//     }
//   }

//   toggleVariantSelection(variantId: string): void {
//     if (this.selectedVariantIds.has(variantId)) {
//       this.selectedVariantIds.delete(variantId);
//     } else {
//       this.selectedVariantIds.add(variantId);
//     }
//   }

//   async deleteSelected(): Promise<void> {
//     for (const productId of this.selectedProductIds) {
//       await this.productService.deleteProduct(productId);
//     }
//     for (const variantId of this.selectedVariantIds) {
//       await this.productService.deleteVariant(variantId);
//     }
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//   }

//   deleteProduct(productId: string): void {
//     this.productService.deleteProduct(productId)
//       .then(() => {
//         this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
//       });
//   }

//   applyFilters(): void {
//     this.products$.pipe(
//       map(products => {
//         let filtered = products.filter(product =>
//           (product.product_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//            product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
//           (this.categoryFilter ? product.category_id === this.categoryFilter : true) &&
//           (this.variantFilter === 'has_variant' ? product.variant_id.length > 0 :
//            this.variantFilter === 'no_variant' ? product.variant_id.length === 0 : true)
//         );

//         if (this.sortFilter === 'name_asc') {
//           filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
//         } else if (this.sortFilter === 'name_desc') {
//           filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
//         } else if (this.sortFilter === 'date_asc') {
//           filtered.sort((a, b) => a.date_listed - b.date_listed);
//         } else if (this.sortFilter === 'date_desc') {
//           filtered.sort((a, b) => b.date_listed - a.date_listed);
//         }

//         return filtered.map(product => ({
//           ...product,
//           variants: product.variants || []
//         }));
//       })
//     ).subscribe(filtered => {
//       this.filteredProducts = filtered;
//       this.expandedProductIds.forEach(productId => {
//         const product = this.filteredProducts.find(p => p.product_id === productId);
//         if (product && !product.variants.length && product.variant_id?.length > 0) {
//           this.productService.getVariants(productId).subscribe(variants => {
//             product.variants = variants;
//           });
//         }
//       });
//     });
//   }

//   createFlashsale(): void {
//     alert('Chức năng tạo flashsale đang được phát triển!');
//   }

//   openAddModal() {
//     this.showAddModal = true;
//   }

//   openEditModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showEditModal = true;
//   }

//   openDetailsModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showDetailsModal = true;
//   }

//   toggleVariants(productId: string) {
//     if (this.expandedProductIds.has(productId)) {
//       this.expandedProductIds.delete(productId);
//       const product = this.filteredProducts.find(p => p.product_id === productId);
//       if (product) product.variants = [];
//     } else {
//       this.expandedProductIds.add(productId);
//       const product = this.filteredProducts.find(p => p.product_id === productId);
//       if (product && product.variant_id?.length > 0 && !product.variants.length) {
//         this.productService.getVariants(productId).subscribe(variants => {
//           product.variants = variants.map(v => ({
//             variant_id: v.variant_id,
//             quantity: v.quantity || 0,
//             price: v.price || 0,
//             image: v.image || 'https://via.placeholder.com/60',
//             variant_name: v.variant_name || ''
//           }));
//         });
//       }
//     }
//   }
// }


// BẢN NÀY CŨM CŨM

// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { Observable } from 'rxjs';
// import { switchMap, map } from 'rxjs/operators';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
// import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
// import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

// @Component({
//   selector: 'app-product-management',
//   templateUrl: './product-management.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent, ProductDetailsModalComponent],
//   providers: [ProductService],
//   styleUrls: ['./product-management.component.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products$: Observable<any[]>;
//   filteredProducts: any[] = [];
//   searchTerm: string = '';
//   categoryFilter: string = '';
//   variantFilter: string = '';
//   sortFilter: string = '';
//   selectedProductIds: Set<string> = new Set();
//   selectedVariantIds: Set<string> = new Set();
//   expandedProductIds: Set<string> = new Set();
//   showAddModal = false;
//   showEditModal = false;
//   showDetailsModal = false;
//   selectedProductId: string = '';

//   categories = [
//     { id: 'Food & Treats', name: 'Food & Treats', children: ['Dry Food', 'Wet Food', 'Treats'] },
//     { id: 'Pet Care', name: 'Pet Care', children: ['Dental Care', 'Supplements & Vitamins',  'Flea & Tick Control', 'Shampoos & Conditioners', 'Brushes & Combs', 'Nail Care', 'Deodorant Tools'] },
//     { id: 'Toys', name: 'Toys', children: ['Toys', 'Training'] },
//     { id: 'Accessories', name: 'Accessories', children: ['Collars & Leashes', 'Apparel & Costume', 'Feeders'] },
//     { id: 'Furniture', name: 'Furniture', children: ['Bedding', 'Crates, Houses & Pens'] },
//     { id: 'Carriers & Kennels', name: 'Carriers & Kennels', children: ['Carriers', 'Kennels'] }
//   ];
  
//   constructor(private productService: ProductService) {
//     this.products$ = this.productService.getProducts();
//   }

//   ngOnInit(): void {
//     this.products$.pipe(
//       switchMap(products => {
//         this.filteredProducts = products;
//         const variantPromises = products.map(product =>
//           this.productService.getVariants(product.variant_id).toPromise().then(variants => {
//             product.variants = (variants ?? []).map(variant => ({
//               ...variant,
//               variant_price: variant.variant_price,  // Adding variant_price
//               variant_quantity: variant.variant_quantity,  // Adding variant_quantity
//             }));
//             return product;
//           })
//         );
//         return Promise.all(variantPromises).then(() => this.applyFilters());
//       })
//     ).subscribe(() => {});
//   }

//   // Toggle select all products and variants
//   toggleSelectAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();
//     if (checked) {
//       this.filteredProducts.forEach(product => {
//         this.selectedProductIds.add(product.product_id);
//         product.variants?.forEach((variant: any) => this.selectedVariantIds.add(variant.variant_id));
//       });
//     }
//   }

//   // Toggle individual product selection
//   toggleProductSelection(productId: string): void {
//     if (this.selectedProductIds.has(productId)) {
//       this.selectedProductIds.delete(productId);
//     } else {
//       this.selectedProductIds.add(productId);
//     }
//   }

//   // Toggle individual variant selection
//   toggleVariantSelection(variantId: string): void {
//     if (this.selectedVariantIds.has(variantId)) {
//       this.selectedVariantIds.delete(variantId);
//     } else {
//       this.selectedVariantIds.add(variantId);
//     }
//   }

//   // Delete selected products and variants
//   async deleteSelected(): Promise<void> {
//     // Delete products
//     for (const productId of this.selectedProductIds) {
//       await this.productService.deleteProduct(productId);
//     }
    
//     // Delete variants
//     for (const variantId of this.selectedVariantIds) {
//       await this.productService.deleteVariant(variantId);
//     }

//     // Clear the selection
//     this.selectedProductIds.clear();
//     this.selectedVariantIds.clear();

//     // Re-fetch the product list after deletion
//     this.products$ = this.productService.getProducts();
//   }

//   // Delete product
//   deleteProduct(productId: string): void {
//     this.productService.deleteProduct(productId)
//       .then(() => {
//         this.filteredProducts = this.filteredProducts.filter(product => product.product_id !== productId);
//       });
//   }

//   applyFilters(): void {
//     this.products$.pipe(
//       map(products => {
//         let filtered = products.filter(product =>
//           (product.product_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//            product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
//           (this.categoryFilter ? product.category_id === this.categoryFilter : true) &&
//           (this.variantFilter === 'has_variant' ? product.variant_id.length > 0 :
//            this.variantFilter === 'no_variant' ? product.variant_id.length === 0 : true)
//         );

//         if (this.sortFilter === 'name_asc') {
//           filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
//         } else if (this.sortFilter === 'name_desc') {
//           filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
//         } else if (this.sortFilter === 'date_asc') {
//           filtered.sort((a, b) => a.date_listed - b.date_listed);
//         } else if (this.sortFilter === 'date_desc') {
//           filtered.sort((a, b) => b.date_listed - a.date_listed);
//         }

//         return filtered.map(product => ({
//           ...product,
//           variants: product.variants || []
//         }));
//       })
//     ).subscribe(filtered => {
//       this.filteredProducts = filtered;
//     });
//   }

//   createFlashsale(): void {
//     alert('Chức năng tạo flashsale đang được phát triển!');
//   }

//   openAddModal() {
//     this.showAddModal = true;
//   }

//   openEditModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showEditModal = true;
//   }

//   openDetailsModal(productId: string) {
//     this.selectedProductId = productId;
//     this.showDetailsModal = true;
//   }

//   toggleVariants(productId: string) {
//   const productRow = document.querySelector(`[data-product-id="${productId}"]`);
//   if (this.expandedProductIds.has(productId)) {
//     this.expandedProductIds.delete(productId);
//     if (productRow) productRow.classList.remove('selected');
//     const product = this.filteredProducts.find(p => p.product_id === productId);
//     if (product) product.variants = [];
//   } else {
//     this.expandedProductIds.add(productId);
//     if (productRow) productRow.classList.add('selected');
//     const product = this.filteredProducts.find(p => p.product_id === productId);
//     if (product && product.variant_id?.length > 0 && !product.variants.length) {
//       this.productService.getVariants(productId).subscribe(variants => {
//         product.variants = variants.map(v => ({
//           variant_id: v.variant_id,
//           quantity: v.variant_quantity || 0,
//           price: v.variant_price || 0,
//           image: v.variant_image || 'https://via.placeholder.com/60',
//           variant_name: v.variant_name || ''
//         }));
//       });
//     }
//   }
// }

// }

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';

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
  
  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.products$.pipe(
      switchMap(products => {
        this.filteredProducts = products;
        const variantPromises = products.map(product =>
          this.productService.getVariants(product.product_id).toPromise().then(variants => {
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
    ).subscribe(() => {});
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

  async deleteSelected(): Promise<void> {
    try {
      // Delete variants first
      for (const variantId of this.selectedVariantIds) {
        try {
          await this.productService.deleteVariant(variantId);
        } catch (variantError) {
          console.warn(`Failed to delete variant ${variantId}:`, variantError);
        }
      }
      // Delete products
      for (const productId of this.selectedProductIds) {
        try {
          await this.productService.deleteProduct(productId);
        } catch (productError) {
          console.warn(`Failed to delete product ${productId}:`, productError);
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
    });
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
    if (this.expandedProductIds.has(productId)) {
      this.expandedProductIds.delete(productId);
      const product = this.filteredProducts.find(p => p.product_id === productId);
      if (product) product.variants = [];
    } else {
      this.expandedProductIds.add(productId);
      const product = this.filteredProducts.find(p => p.product_id === productId);
      if (product && product.variant_id?.length > 0 && !product.variants.length) {
        this.productService.getVariants(productId).subscribe(variants => {
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
